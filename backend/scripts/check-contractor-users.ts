import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  const contractors = await prisma.user.findMany({
    where: {
      role: 'CONTRACTOR',
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
    },
  });

  console.log('Users with CONTRACTOR role:', contractors.length);
  console.log(JSON.stringify(contractors, null, 2));

  await prisma.$disconnect();
}

checkUsers();
