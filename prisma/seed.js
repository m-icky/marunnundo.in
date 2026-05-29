require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clear existing data
  await prisma.notification.deleteMany();
  await prisma.operatingHours.deleteMany();
  await prisma.review.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.pharmacy.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database tables.');

  // 2. Hash passwords
  const adminPassword = await bcrypt.hash('adminpassword', 10);
  const ownerPassword = await bcrypt.hash('owner123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  // 3. Create Users
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@marunnundo.in',
      name: 'Marunnundo Super Admin',
      password: adminPassword,
      role: 'SUPERADMIN',
    },
  });

  const owner1 = await prisma.user.create({
    data: {
      email: 'owner1@gmail.com',
      name: 'Dr. Joseph Mathew',
      phone: '+919446012345',
      password: ownerPassword,
      role: 'OWNER',
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      email: 'owner2@gmail.com',
      name: 'K. R. Hariharan',
      phone: '+919447012345',
      password: ownerPassword,
      role: 'OWNER',
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: 'naveen@gmail.com',
      name: 'Naveen Kumar',
      phone: '+919845012345',
      password: userPassword,
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'ananya@gmail.com',
      name: 'Ananya Nair',
      phone: '+919846012345',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log('👤 Seeded users, owners, and super admin.');

  // 4. Create Pharmacies
  // Pharmacy 1: Ernakulam M.G. Road (Kochi)
  const pharmacy1 = await prisma.pharmacy.create({
    data: {
      name: 'Care & Cure Pharmacy',
      licenseNumber: 'KL-EKM-123456',
      address: 'Opp. Maharaja Metro Station, M.G. Road, Ernakulam, Kerala',
      contactNumber: '+914842345678',
      whatsappNumber: '919876543210',
      logo: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=150&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1607619056574-7b8d304b3b3a?w=800&auto=format&fit=crop&q=60',
      deliveryAvailable: true,
      deliveryRadius: 8.0,
      emergencySupport: true,
      latitude: 9.9723,
      longitude: 76.2801,
      rating: 4.8,
      isVerified: true,
      ownerId: owner1.id,
    },
  });

  // Pharmacy 2: Thiruvananthapuram Palayam (Trivandrum)
  const pharmacy2 = await prisma.pharmacy.create({
    data: {
      name: 'Jeevan Medicals',
      licenseNumber: 'KL-TVM-654321',
      address: 'Near Palayam Juma Masjid, Palayam, Thiruvananthapuram, Kerala',
      contactNumber: '+914712345678',
      whatsappNumber: '919876543211',
      logo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=150&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop&q=60',
      deliveryAvailable: false,
      deliveryRadius: 3.0,
      emergencySupport: true,
      latitude: 8.5061,
      longitude: 76.9515,
      rating: 4.5,
      isVerified: true,
      ownerId: owner1.id,
    },
  });

  // Pharmacy 3: Kozhikode Mananchira
  const pharmacy3 = await prisma.pharmacy.create({
    data: {
      name: 'Malabar Medicos',
      licenseNumber: 'KL-KKD-987654',
      address: 'Mananchira Square South, Kozhikode, Kerala',
      contactNumber: '+914952345678',
      whatsappNumber: '919876543212',
      logo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=800&auto=format&fit=crop&q=60',
      deliveryAvailable: true,
      deliveryRadius: 10.0,
      emergencySupport: false,
      latitude: 11.2588,
      longitude: 75.7804,
      rating: 4.2,
      isVerified: true,
      ownerId: owner2.id,
    },
  });

  // Pharmacy 4: East Fort Thrissur
  const pharmacy4 = await prisma.pharmacy.create({
    data: {
      name: 'Kerala Health Pharmacy',
      licenseNumber: 'KL-TCR-321654',
      address: 'Near East Fort Junction, Thrissur, Kerala',
      contactNumber: '+914872345678',
      whatsappNumber: '919876543213',
      logo: 'https://images.unsplash.com/photo-1631549916768-4119b2e55c26?w=150&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&auto=format&fit=crop&q=60',
      deliveryAvailable: true,
      deliveryRadius: 6.0,
      emergencySupport: true,
      latitude: 10.5276,
      longitude: 76.2144,
      rating: 4.6,
      isVerified: true,
      ownerId: owner2.id,
    },
  });

  // Pharmacy 5: Kakkanad Infopark (Kochi) - Unverified for dashboard testing
  const pharmacy5 = await prisma.pharmacy.create({
    data: {
      name: 'Infopark Wellness Meds',
      licenseNumber: 'KL-EKM-777888',
      address: 'Phase 1 Road, Kakkanad, Ernakulam, Kerala',
      contactNumber: '+914842998877',
      whatsappNumber: '919876543214',
      logo: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=150&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1607619056574-7b8d304b3b3a?w=800&auto=format&fit=crop&q=60',
      deliveryAvailable: true,
      deliveryRadius: 5.0,
      emergencySupport: false,
      latitude: 9.9936,
      longitude: 76.3582,
      rating: 0.0,
      isVerified: false, // For Super Admin verification tests!
      ownerId: owner1.id,
    },
  });

  console.log('🏥 Seeded pharmacies.');

  // 5. Seed Operating Hours
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const pharmacies = [pharmacy1, pharmacy2, pharmacy3, pharmacy4, pharmacy5];

  for (const pharmacy of pharmacies) {
    for (const day of days) {
      await prisma.operatingHours.create({
        data: {
          day,
          openTime: '08:30',
          closeTime: '22:30',
          isClosed: day === 'Sunday' && pharmacy.id === pharmacy3.id, // Malabar Medicos closed on Sundays
          pharmacyId: pharmacy.id,
        },
      });
    }
  }

  console.log('⏰ Seeded operating hours.');

  // 6. Seed Medicines
  const baseMedicines = [
    { name: 'Dolo 650', genericName: 'Paracetamol', category: 'Analgesics / Antipyretics', manufacturer: 'Micro Labs Ltd', price: 32.5, prescriptionRequired: false },
    { name: 'Glycomet 500', genericName: 'Metformin Hydrochloride', category: 'Antidiabetics', manufacturer: 'USV Private Ltd', price: 54.0, prescriptionRequired: true },
    { name: 'Alerid 10mg', genericName: 'Cetirizine Hydrochloride', category: 'Antihistamines', manufacturer: 'Cipla Ltd', price: 18.0, prescriptionRequired: false },
    { name: 'Pan 40', genericName: 'Pantoprazole Sodium', category: 'Antacids / Gastrointestinal', manufacturer: 'Alkem Laboratories Ltd', price: 145.0, prescriptionRequired: true },
    { name: 'Lipivas 20', genericName: 'Atorvastatin Calcium', category: 'Cardiovascular', manufacturer: 'Cipla Ltd', price: 110.5, prescriptionRequired: true },
    { name: 'Azee 500', genericName: 'Azithromycin', category: 'Antibiotics / Anti-infectives', manufacturer: 'Cipla Ltd', price: 120.0, prescriptionRequired: true },
    { name: 'Combiflam', genericName: 'Ibuprofen & Paracetamol', category: 'Analgesics / NSAIDs', manufacturer: 'Sanofi India Ltd', price: 45.0, prescriptionRequired: false },
    { name: 'Benadryl Syrup 100ml', genericName: 'Diphenhydramine Compound', category: 'Cough & Cold', manufacturer: 'Kenvue', price: 125.0, prescriptionRequired: false },
    { name: 'Telma 40', genericName: 'Telmisartan', category: 'Cardiovascular', manufacturer: 'Glenmark Pharmaceuticals', price: 98.0, prescriptionRequired: true },
    { name: 'Augmentin 625 DUO', genericName: 'Amoxicillin & Clavulanate Potassium', category: 'Antibiotics / Anti-infectives', manufacturer: 'GSK Ltd', price: 201.2, prescriptionRequired: true },
  ];

  // Seed medicines in each pharmacy
  for (const pharmacy of pharmacies) {
    for (const med of baseMedicines) {
      // Add some randomness to stock and price
      const priceOffset = Math.floor(Math.random() * 10) - 5; // +/- 5 Rs
      const stock = pharmacy.id === pharmacy5.id ? 0 : Math.floor(Math.random() * 150) + 10; // Zero stock in new pharmacy
      await prisma.medicine.create({
        data: {
          name: med.name,
          genericName: med.genericName,
          category: med.category,
          manufacturer: med.manufacturer,
          batchNumber: `B${Math.floor(100000 + Math.random() * 900000)}`,
          expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 2), // 2 years expiry
          quantity: stock,
          price: Math.max(10, med.price + priceOffset),
          prescriptionRequired: med.prescriptionRequired,
          isAvailable: stock > 0,
          pharmacyId: pharmacy.id,
        },
      });
    }
  }

  console.log('💊 Seeded medicines for all pharmacies.');

  // 7. Seed Reviews
  const reviews = [
    { rating: 5, comment: 'Excellent service! Very polite staff. Checked availability on Marunnundo.in and drove here. Highly recommended!' },
    { rating: 4, comment: 'Good stock of diabetes medicines. They even delivered to my home inside a 3km radius.' },
    { rating: 5, comment: 'മരുന്നുകൾ കൃത്യമായി ലഭ്യമാണ്. വളരെ നല്ല പെരുമാറ്റം!' }, // Malayalam review
  ];

  // Seed reviews for verified pharmacies
  const activePharmacies = [pharmacy1, pharmacy2, pharmacy3, pharmacy4];
  const activeUsers = [user1, user2];

  for (let i = 0; i < activePharmacies.length; i++) {
    const pharmacy = activePharmacies[i];
    for (let j = 0; j < reviews.length; j++) {
      const user = activeUsers[j % activeUsers.length];
      const rev = reviews[j];
      await prisma.review.create({
        data: {
          rating: rev.rating,
          comment: rev.comment,
          userId: user.id,
          pharmacyId: pharmacy.id,
          reply: j === 0 ? 'Thank you so much for your kind words! We are glad to serve you.' : null,
        },
      });
    }
  }

  console.log('⭐ Seeded reviews and replies.');

  // 8. Seed a demo notification for owners
  await prisma.notification.create({
    data: {
      title: 'Pharmacy Registered Successfully',
      message: 'Welcome to Marunnundo.in! Your pharmacy has been registered and is pending verification by our administrators.',
      userId: owner1.id,
    },
  });

  console.log('🔔 Seeded notifications.');
  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
