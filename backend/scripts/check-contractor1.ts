import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'contractor1@zimbuildhub.com' },
    include: { contractor: true }
  });

  console.log('User with contractor1@zimbuildhub.com:');
  console.log(JSON.stringify(user, null, 2));

  // Also check all contractors
  const allContractors = await prisma.contractor.findMany({
    include: {
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
          role: true
        }
      }
    }
  });

  console.log('\n\nAll contractors in database:');
  console.log(JSON.stringify(allContractors, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
