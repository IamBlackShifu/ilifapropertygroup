import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';
import { JwtPayload } from '../common/interfaces';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: dto.role || UserRole.BUYER,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        emailVerified: true,
        isActive: true,
        profileImageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(user);

    // Store refresh token
    await this.storeRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        userId: user.id, // For backward compatibility
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        avatar: user.profileImageUrl,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        profileImageUrl: user.profileImageUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(dto: LoginDto) {
    try {
      console.log('🔵 [AuthService] Starting login for:', dto.email);
      
      // Validate user
      const user = await this.validateUser(dto.email, dto.password);

      if (!user) {
        console.log('❌ [AuthService] Invalid credentials for:', dto.email);
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check if user is active
      if (!user.isActive || user.isSuspended) {
        console.log('❌ [AuthService] Inactive/suspended account:', dto.email);
        throw new UnauthorizedException('Account is inactive or suspended');
      }

      console.log('✅ [AuthService] User validated:', dto.email);

      // Update last login
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      // Generate tokens
      console.log('🔵 [AuthService] Generating tokens for:', dto.email);
      const { accessToken, refreshToken } = await this.generateTokens(user);
      console.log('✅ [AuthService] Tokens generated successfully');

      // Store refresh token
      await this.storeRefreshToken(user.id, refreshToken);
      console.log('✅ [AuthService] Refresh token stored');

      return {
        user: {
          id: user.id,
          userId: user.id, // For backward compatibility
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          avatar: user.profileImageUrl,
          emailVerified: user.emailVerified,
          isActive: user.isActive,
          profileImageUrl: user.profileImageUrl,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error('❌ [AuthService] Login error:', error);
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async refreshTokens(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });

      // Check if token exists in database
      const hashedToken = await bcrypt.hash(refreshToken, 10);
      const storedToken = await this.prisma.refreshToken.findFirst({
        where: {
          userId: payload.sub,
          isRevoked: false,
        },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Get user
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive || user.isSuspended) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Revoke old token
      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { isRevoked: true },
      });

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      // Store new refresh token
      await this.storeRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      // Revoke specific token
      await this.prisma.refreshToken.updateMany({
        where: {
          userId,
          isRevoked: false,
        },
        data: { isRevoked: true },
      });
    } else {
      // Revoke all tokens
      await this.prisma.refreshToken.updateMany({
        where: { userId },
        data: { isRevoked: true },
      });
    }
  }

  async forgotPassword(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        firstName: true,
        isActive: true,
        isSuspended: true,
      },
    });

    const response = {
      message: 'If an account exists for that email, a password reset link has been sent.',
    };

    if (!user || !user.isActive || user.isSuspended) {
      return response;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashResetToken(token);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      data: { usedAt: new Date() },
    });

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    await this.sendPasswordResetEmail(user.email, user.firstName, token);

    return response;
  }

  async resetPassword(token: string, password: string) {
    const tokenHash = this.hashResetToken(token);
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (
      !resetToken ||
      resetToken.usedAt ||
      resetToken.expiresAt <= new Date() ||
      !resetToken.user.isActive ||
      resetToken.user.isSuspended
    ) {
      throw new BadRequestException('Invalid or expired password reset link');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.passwordResetToken.updateMany({
        where: {
          userId: resetToken.userId,
          usedAt: null,
        },
        data: { usedAt: new Date() },
      }),
      this.prisma.refreshToken.updateMany({
        where: {
          userId: resetToken.userId,
          isRevoked: false,
        },
        data: { isRevoked: true },
      }),
    ]);

    return { message: 'Password reset successful. You can now sign in with your new password.' };
  }

  private async generateTokens(user: Pick<User, 'id' | 'email' | 'role'>) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRES_IN') || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN') || '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(userId: string, token: string) {
    const hashedToken = await bcrypt.hash(token, 10);
    const expiresIn = this.config.get('JWT_REFRESH_EXPIRES_IN') || '7d';
    
    // Parse expiry
    const expiryMs = this.parseExpiry(expiresIn);
    const expiresAt = new Date(Date.now() + expiryMs);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: hashedToken,
        expiresAt,
      },
    });
  }

  private parseExpiry(expiry: string): number {
    const unit = expiry.slice(-1);
    const value = parseInt(expiry.slice(0, -1));

    const units: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return value * (units[unit] || units.m);
  }

  private hashResetToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async sendPasswordResetEmail(email: string, firstName: string, token: string) {
    const frontendUrl =
      this.config.get<string>('FRONTEND_URL') ||
      this.config.get<string>('NEXT_PUBLIC_APP_URL') ||
      'http://localhost:3000';
    const resetUrl = `${frontendUrl.replace(/\/$/, '')}/auth/reset-password?token=${token}`;

    if (!this.isMailConfigured()) {
      if (this.config.get<string>('NODE_ENV') !== 'production') {
        console.warn(`Password reset mail is not configured. Reset link for ${email}: ${resetUrl}`);
        return;
      }

      throw new BadRequestException('Password reset email could not be sent');
    }

    const transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAIL_HOST'),
      port: Number(this.config.get<string>('MAIL_PORT') || 587),
      secure: Number(this.config.get<string>('MAIL_PORT')) === 465,
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASSWORD'),
      },
    });

    await transporter.sendMail({
      from: this.config.get<string>('MAIL_FROM') || 'noreply@zimbuild.com',
      to: email,
      subject: 'Reset your ILifa Property Group password',
      text: [
        `Hi ${firstName},`,
        '',
        'We received a request to reset your password.',
        `Use this secure link to set a new password: ${resetUrl}`,
        '',
        'This link expires in 1 hour. If you did not request this, you can ignore this email.',
      ].join('\n'),
      html: `
        <p>Hi ${firstName},</p>
        <p>We received a request to reset your password.</p>
        <p><a href="${resetUrl}">Set a new password</a></p>
        <p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p>
      `,
    });
  }

  private isMailConfigured(): boolean {
    const host = this.config.get<string>('MAIL_HOST');
    const user = this.config.get<string>('MAIL_USER');
    const password = this.config.get<string>('MAIL_PASSWORD');

    return Boolean(
      host &&
        user &&
        password &&
        !user.includes('your-email') &&
        !password.includes('your-app-password'),
    );
  }
}
