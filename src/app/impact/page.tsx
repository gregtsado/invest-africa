import { prisma } from '@/lib/prisma'
import Image from 'next/image'

async function getImpactMetrics() {
  const [totalInvestments, activeListings, successfulDeals] = await Promise.all([
    prisma.engagementRequest.aggregate({
      where: { status: 'APPROVED' },
      _sum: { amount: true },
    }),
    prisma.listing.count({
      where: { status: 'ACTIVE' },
    }),
    prisma.engagementRequest.count({
      where: { status: 'APPROVED' },
    }),
  ])

  return {
    totalInvestment: totalInvestments._sum.amount || 0,
    activeListings,
    successfulDeals,
  }
}

export default async function Impact() {
  const metrics = await getImpactMetrics()

  const impactCategories = [
    {
      name: 'Environmental Impact',
      description: 'Supporting sustainable and environmentally conscious projects across Africa',
      metrics: [
        { name: 'Renewable Energy Generated', value: '500+ MW' },
        { name: 'CO2 Emissions Reduced', value: '1.2M tons' },
        { name: 'Land Conserved', value: '50,000 hectares' },
      ],
    },
    {
      name: 'Social Impact',
      description: 'Creating opportunities and improving lives in local communities',
      metrics: [
        { name: 'Jobs Created', value: '25,000+' },
        { name: 'Lives Impacted', value: '100,000+' },
        { name: 'Communities Supported', value: '500+' },
      ],
    },
    {
      name: 'Economic Impact',
      description: 'Driving economic growth and development across the continent',
      metrics: [
        { name: 'Total Investment', value: `$${(metrics.totalInvestment / 1000000).toFixed(1)}M` },
        { name: 'Active Projects', value: metrics.activeListings },
        { name: 'Successful Deals', value: metrics.successfulDeals },
      ],
    },
  ]

  const successStories = [
    {
      title: 'Solar Power Revolution in Kenya',
      description: 'A community-based solar project that brought reliable electricity to 50,000 homes.',
      image: '/solar-project.jpg',
      stats: [
        { name: 'Investment', value: '$2.5M' },
        { name: 'Homes Powered', value: '50,000' },
        { name: 'CO2 Reduced', value: '15,000 tons/year' },
      ],
    },
    {
      title: 'Sustainable Agriculture in Ghana',
      description: 'Modern farming techniques and equipment empowering local farmers and increasing yields.',
      image: '/agriculture-project.jpg',
      stats: [
        { name: 'Investment', value: '$1.8M' },
        { name: 'Farmers Supported', value: '2,000+' },
        { name: 'Yield Increase', value: '300%' },
      ],
    },
  ]

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-14">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Our Impact
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Together, we're building a sustainable and prosperous future for Africa through strategic investments
              that deliver both financial returns and meaningful impact.
            </p>
          </div>
        </div>
      </div>

      {/* Impact Categories */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Making a Difference
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Our investments create lasting positive change across multiple dimensions
            </p>
          </div>

          <div className="mt-16 space-y-16">
            {impactCategories.map((category) => (
              <div key={category.name} className="bg-white overflow-hidden">
                <div className="px-6 py-8 sm:px-8 sm:py-10">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      {category.description}
                    </p>
                  </div>
                  <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3">
                    {category.metrics.map((metric) => (
                      <div key={metric.name} className="border-t border-gray-100 pt-6">
                        <dt className="text-sm font-medium text-gray-500">{metric.name}</dt>
                        <dd className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                          {metric.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Success Stories
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Real projects creating real impact across Africa
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {successStories.map((story) => (
              <article key={story.title} className="bg-white p-8 rounded-2xl shadow-sm ring-1 ring-gray-200">
                <div className="relative w-full">
                  <Image
                    src={story.image}
                    alt={story.title}
                    className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                    width={500}
                    height={300}
                  />
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-bold tracking-tight text-gray-900">
                    {story.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-gray-600">
                    {story.description}
                  </p>
                  <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
                    {story.stats.map((stat) => (
                      <div key={stat.name} className="border-t border-gray-100 pt-4">
                        <dt className="text-sm font-medium text-gray-500">{stat.name}</dt>
                        <dd className="mt-2 text-base font-semibold tracking-tight text-gray-900">
                          {stat.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}