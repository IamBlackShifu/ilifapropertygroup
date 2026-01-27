import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('📊 Checking database data...\n');

    // Count users by role
    const users = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
    });

    console.log('👥 USERS BY ROLE:');
    for (const user of users) {
      console.log(`   ${user.role}: ${user._count} users`);
    }

    const totalUsers = await prisma.user.count();
    console.log(`   TOTAL: ${totalUsers} users\n`);

    // Count properties by status
    const properties = await prisma.property.groupBy({
      by: ['status'],
      _count: true,
    });

    console.log('🏠 PROPERTIES BY STATUS:');
    for (const property of properties) {
      console.log(`   ${property.status}: ${property._count} properties`);
    }

    const totalProperties = await prisma.property.count();
    console.log(`   TOTAL: ${totalProperties} properties\n`);

    // Count verifications
    const verifications = await prisma.verification.groupBy({
      by: ['status'],
      _count: true,
    });

    console.log('✅ VERIFICATIONS BY STATUS:');
    for (const verification of verifications) {
      console.log(`   ${verification.status}: ${verification._count} verifications`);
    }

    const totalVerifications = await prisma.verification.count();
    console.log(`   TOTAL: ${totalVerifications} verifications\n`);

    // Sample users
    const sampleUsers = await prisma.user.findMany({
      take: 5,
      select: {
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log('👤 RECENT USERS:');
    sampleUsers.forEach((user, i) => {
      console.log(`   ${i + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ${user.role}`);
    });

    console.log('\n✅ Database check complete!');
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
