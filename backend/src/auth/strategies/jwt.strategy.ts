import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../../common/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        isSuspended: true,
        profileImageUrl: true,
      },
    });

    if (!user || !user.isActive || user.isSuspended) {
      return null;
    }

    // Transform to match frontend interface
    return {
      id: user.id,
      userId: user.id, // For backward compatibility
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.profileImageUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
