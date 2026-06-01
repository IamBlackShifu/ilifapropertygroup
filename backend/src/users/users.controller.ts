import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser('id') userId: string) {
    const user = await this.usersService.findById(userId);
    return {
      success: true,
      data: user,
    };
  }

  @Patch('profile')
  async updateProfile(@CurrentUser('id') userId: string, @Body() data: any) {
    const user = await this.usersService.updateProfile(userId, data);
    return {
      success: true,
      data: user,
      message: 'Profile updated successfully',
    };
  }

  @Patch('change-password')
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(userId, dto.currentPassword, dto.newPassword);
    return {
      success: true,
      message: 'Password updated successfully',
    };
  }
}
