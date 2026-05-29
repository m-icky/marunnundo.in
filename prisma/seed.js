require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding (Production / Clean)...');

  // 1. Clear existing data to ensure a clean start
  await prisma.notification.deleteMany();
  await prisma.operatingHours.deleteMany();
  await prisma.review.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.pharmacy.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database tables.');

  // 2. Hash Super Admin password
  const adminPassword = await bcrypt.hash('admin@marunnundo#123', 10);

  // 3. Create Super Admin User
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@marunnundo.in',
      name: 'Marunnundo Super Admin',
      password: adminPassword,
      role: 'SUPERADMIN',
    },
  });

  console.log('👤 Seeded Super Admin user:', superAdmin.email);
  console.log('🎉 Clean database setup complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
