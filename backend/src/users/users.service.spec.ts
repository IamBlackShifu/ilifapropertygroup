import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

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

describe('UsersService.updateProfile', () => {
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

  it('stores company identity for an agent', async () => {
    prisma.user.findUnique.mockResolvedValue({ role: UserRole.AGENT });
    prisma.user.update.mockResolvedValue({ id: 'agent-1' });

    await usersService.updateProfile('agent-1', {
      firstName: ' Tariro ',
      companyName: ' Harare Homes ',
      companyLogoUrl: '/uploads/companies/logo.png',
      agentRegistrationNumber: ' EAC-123 ',
    });

    expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'agent-1' },
      data: expect.objectContaining({
        firstName: 'Tariro',
        companyName: 'Harare Homes',
        companyLogoUrl: '/uploads/companies/logo.png',
        agentRegistrationNumber: 'EAC-123',
      }),
    }));
  });

  it('does not allow a non-agent to publish agency fields', async () => {
    prisma.user.findUnique.mockResolvedValue({ role: UserRole.OWNER });
    prisma.user.update.mockResolvedValue({ id: 'owner-1' });

    await usersService.updateProfile('owner-1', {
      companyName: 'Not an agency',
      agentRegistrationNumber: 'FAKE-1',
    });

    const update = prisma.user.update.mock.calls[0][0];
    expect(update.data).not.toHaveProperty('companyName');
    expect(update.data).not.toHaveProperty('agentRegistrationNumber');
  });

  it('throws when the profile no longer exists', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(usersService.updateProfile('missing', { firstName: 'Test' }))
      .rejects.toBeInstanceOf(NotFoundException);
  });
});
