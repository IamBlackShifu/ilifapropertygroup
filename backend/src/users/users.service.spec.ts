import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('UsersService.changePassword', () => {
  let usersService: UsersService;
  let prisma: { user: { findUnique: jest.Mock; update: jest.Mock } };

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    usersService = new UsersService(prisma as unknown as PrismaService);
  });

  it('throws when user is not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      usersService.changePassword('user-1', 'current', 'newPassword123')
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects when current password is incorrect', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'user-1', passwordHash: 'hash' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      usersService.changePassword('user-1', 'wrong', 'newPassword123')
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('updates password hash when current password matches', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'user-1', passwordHash: 'hash' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue('newHash');

    await usersService.changePassword('user-1', 'current', 'newPassword123');

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { passwordHash: 'newHash' },
    });
  });
});
