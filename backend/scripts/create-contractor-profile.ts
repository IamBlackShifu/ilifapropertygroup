import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Find contractor user
    const contractorUser = await prisma.user.findFirst({
      where: { role: 'CONTRACTOR' },
    });

    if (!contractorUser) {
      console.log('No contractor user found');
      return;
    }

    console.log('Found contractor user:', contractorUser.email);

    // Check if contractor profile already exists
    const existingProfile = await prisma.contractor.findUnique({
      where: { userId: contractorUser.id },
    });

    if (existingProfile) {
      console.log('Contractor profile already exists');
      return;
    }

    // Create contractor profile
    const contractor = await prisma.contractor.create({
      data: {
        userId: contractorUser.id,
        companyName: 'Doe Construction',
        registrationNumber: 'REG-2024-001',
        yearsExperience: 10,
        employeesCount: 15,
        locationCity: 'Harare',
        locationAddress: '123 Main Street, Harare',
        description: 'Professional construction company with 10 years of experience in residential and commercial projects.',
        servicesOffered: ['New Construction', 'Renovation', 'Remodeling', 'Home Extensions'],
        status: 'PENDING',
        isVerified: false,
      },
    });

    console.log('✅ Contractor profile created successfully:', contractor.id);
    console.log('Profile details:', {
      userId: contractor.userId,
      companyName: contractor.companyName,
      status: contractor.status,
      servicesOffered: contractor.servicesOffered,
    });
  } catch (error) {
    console.error('Error creating contractor profile:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
