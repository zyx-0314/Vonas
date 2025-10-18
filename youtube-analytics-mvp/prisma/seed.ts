/**
 * Module: prisma/seed.ts
 * Purpose: Database seeder for initial admin user and sample data.
 * Creates:
 *   - Admin user with email: admin@gmail.com, password: admin
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@gmail.com' }
  });

  if (existingAdmin) {
    console.log('ℹ️  Admin user already exists, skipping creation');
  } else {
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin', 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@gmail.com',
        name: 'Admin User',
        password: hashedPassword,
        isAdmin: true,
        channelId: 'admin-channel-demo'
      }
    });

    console.log('✅ Admin user created:', {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      isAdmin: adminUser.isAdmin
    });

    // Create sample channel metrics for the admin user
    const metricsData = [
      {
        userId: adminUser.id,
        views: 125000,
        subscribers: 12500,
        watchTime: 850000,
        revenue: 2500.50,
        date: new Date('2025-10-01')
      },
      {
        userId: adminUser.id,
        views: 138000,
        subscribers: 13200,
        watchTime: 920000,
        revenue: 2750.75,
        date: new Date('2025-10-15')
      },
      {
        userId: adminUser.id,
        views: 142000,
        subscribers: 13800,
        watchTime: 965000,
        revenue: 2890.25,
        date: new Date('2025-10-18')
      }
    ];

    await prisma.channelMetrics.createMany({
      data: metricsData
    });

    console.log('✅ Sample channel metrics created for admin user');
  }

  console.log('🎉 Database seeding completed!');
  console.log('');
  console.log('📋 Admin Login Credentials:');
  console.log('   Email: admin@gmail.com');
  console.log('   Password: admin');
  console.log('');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });