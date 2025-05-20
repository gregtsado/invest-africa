import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { PlaceholderImage } from '@/components/PlaceholderImage'
import Image from 'next/image'

async function getHomePageData() {
  const [featuredListings, metrics] = await Promise.all([
    prisma.listing.findMany({
      where: { 
        status: 'ACTIVE',
        featured: true,
      },
      take: 3,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.engagementRequest.aggregate({
      where: { status: 'APPROVED' },
      _sum: { amount: true },
      _count: true,
    }),
  ])

  return {
    featuredListings,
    totalInvestment: metrics._sum.amount || 0,
    totalDeals: metrics._count,
  }
}

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { featuredListings, totalInvestment, totalDeals } = await getHomePageData()

  const stats = [
    { name: 'Total Investment', value: `$${(totalInvestment / 1000000).toFixed(1)}M` },
    { name: 'Successful Deals', value: totalDeals },
    { name: 'Countries', value: '12' },
    { name: 'Impact Projects', value: '200+' },
  ]

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Invest in Africa's Future
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Discover and invest in transformative opportunities across Africa. Join us in building a sustainable and prosperous future.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/investments"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Browse Investments
              </Link>
              <Link href="/impact" className="text-sm font-semibold leading-6 text-white">
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Feature Grid */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-sm">
              <div className="p-8">
                <Image
                  src="/images/agriculture.jpg"
                  alt="Agriculture"
                  width={400}
                  height={300}
                  className="rounded-lg object-cover mb-6"
                />
                <h3 className="text-xl font-semibold text-white mb-2">Sustainable Agriculture</h3>
                <p className="text-gray-300">Support innovative farming projects that enhance food security and empower local communities.</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-sm">
              <div className="p-8">
                <Image
                  src="/images/solar-farm.jpg"
                  alt="Renewable Energy"
                  width={400}
                  height={300}
                  className="rounded-lg object-cover mb-6"
                />
                <h3 className="text-xl font-semibold text-white mb-2">Renewable Energy</h3>
                <p className="text-gray-300">Invest in clean energy solutions that power Africa's sustainable development.</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-sm">
              <div className="p-8">
                <Image
                  src="/images/community.jpg"
                  alt="Community Development"
                  width={400}
                  height={300}
                  className="rounded-lg object-cover mb-6"
                />
                <h3 className="text-xl font-semibold text-white mb-2">Community Development</h3>
                <p className="text-gray-300">Transform lives through investments in education, healthcare, and infrastructure.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Featured Opportunities</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Explore our carefully selected investment opportunities
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {featuredListings.map((listing) => (
              <article
                key={listing.id}
                className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
              >
                <PlaceholderImage 
                  alt={listing.title}
                  className="absolute inset-0 -z-10 h-full w-full object-cover"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                  <Link href={`/investments/${listing.id}`}>
                    <span className="absolute inset-0" />
                    {listing.title}
                  </Link>
                </h3>
                <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                  <div>
                    {listing.sector} • {listing.countryCode}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
