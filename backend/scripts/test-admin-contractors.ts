import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Get all users with CONTRACTOR role
  const contractorUsers = await prisma.user.findMany({
    where: { role: 'CONTRACTOR' },
    include: { contractor: true }
  });

  console.log('=== All Users with CONTRACTOR Role ===\n');
  
  for (const user of contractorUsers) {
    console.log(`Name: ${user.firstName} ${user.lastName}`);
    console.log(`Email: ${user.email}`);
    console.log(`Has Profile: ${user.contractor ? 'YES' : 'NO'}`);
    if (user.contractor) {
      console.log(`  Company: ${user.contractor.companyName}`);
      console.log(`  Status: ${user.contractor.status}`);
    }
    console.log('---\n');
  }

  console.log('\n=== Testing Admin Endpoint Logic ===\n');

  // Simulate the admin service query
  const contractors = await prisma.contractor.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
      _count: {
        select: {
          stages: true,
          reviews: true,
        },
      },
    },
  });

  console.log(`Contractors with profiles: ${contractors.length}`);

  const incompleteContractors = await prisma.user.findMany({
    where: {
      role: 'CONTRACTOR',
      contractor: null,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      createdAt: true,
    },
  });

  console.log(`Contractors without profiles: ${incompleteContractors.length}\n`);

  if (incompleteContractors.length > 0) {
    console.log('Incomplete contractors:');
    incompleteContractors.forEach(user => {
      console.log(`  - ${user.firstName} ${user.lastName} (${user.email})`);
    });
  }

  console.log(`\nTotal contractors to show in admin: ${contractors.length + incompleteContractors.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
