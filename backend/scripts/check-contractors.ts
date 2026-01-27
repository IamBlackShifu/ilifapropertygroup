import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkContractors() {
  const contractors = await prisma.contractor.findMany({
    include: {
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
    },
  });

  console.log('Total contractors:', contractors.length);
  console.log(JSON.stringify(contractors, null, 2));

  await prisma.$disconnect();
}

checkContractors();
