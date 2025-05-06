const { PrismaClient, UserRole, ListingStatus, EngagementType } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.engagementRequest.deleteMany()
  await prisma.listing.deleteMany()
  await prisma.user.deleteMany()

  // Create test users
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const contributorPassword = await bcrypt.hash('contributor123', 10)
  const contributor = await prisma.user.create({
    data: {
      name: 'Contributor User',
      email: 'contributor@example.com',
      password: contributorPassword,
      role: 'CONTRIBUTOR',
    },
  })

  const investorPassword = await bcrypt.hash('investor123', 10)
  const investor = await prisma.user.create({
    data: {
      name: 'Investor User',
      email: 'investor@example.com',
      password: investorPassword,
      role: 'INVESTOR',
    },
  })

  // Create test listings
  const listings = await Promise.all([
    // Active and featured listing
    prisma.listing.create({
      data: {
        title: 'Solar Farm Project in Kenya',
        description: 'Large-scale solar installation providing clean energy to 50,000 homes',
        countryCode: 'KE',
        sector: 'Renewable Energy',
        sizeMin: 100000,
        sizeMax: 5000000,
        returnPct: 12,
        timeline: '36 months',
        status: 'ACTIVE',
        featured: true,
        impactMetrics: {
          homesServed: 50000,
          co2Reduced: 15000,
          jobsCreated: 200,
        },
        mediaUrls: ['/images/solar-farm.jpg'],
        userId: admin.id,
      },
    }),

    // Another active listing
    prisma.listing.create({
      data: {
        title: 'Sustainable Agriculture in Ghana',
        description: 'Modern farming techniques empowering local farmers',
        countryCode: 'GH',
        sector: 'Agriculture',
        sizeMin: 50000,
        sizeMax: 2000000,
        returnPct: 8,
        timeline: '24 months',
        status: 'ACTIVE',
        featured: true,
        impactMetrics: {
          farmersSupported: 2000,
          yieldIncrease: 300,
          jobsCreated: 150,
        },
        mediaUrls: ['/images/agriculture.jpg'],
        userId: contributor.id,
      },
    }),

    // Pending listing
    prisma.listing.create({
      data: {
        title: 'Education Technology Center',
        description: 'Building a tech education hub in Nigeria',
        countryCode: 'NG',
        sector: 'Education',
        sizeMin: 75000,
        sizeMax: 1500000,
        returnPct: 10,
        timeline: '18 months',
        status: 'PENDING',
        featured: false,
        impactMetrics: {
          studentsServed: 5000,
          teachersEmployed: 50,
          graduationRate: 95,
        },
        mediaUrls: [],
        userId: contributor.id,
      },
    }),
  ])

  // Create test engagement requests
  await Promise.all([
    prisma.engagementRequest.create({
      data: {
        type: 'SELF',
        amount: 250000,
        status: 'PENDING',
        details: 'Interested in direct investment',
        userId: investor.id,
        listingId: listings[0].id,
      },
    }),
    prisma.engagementRequest.create({
      data: {
        type: 'MANAGED',
        amount: 100000,
        status: 'APPROVED',
        details: 'Looking for managed investment option',
        userId: investor.id,
        listingId: listings[1].id,
      },
    }),
  ])

  console.log('Test data seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })