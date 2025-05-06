import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { PlaceholderImage } from '@/components/PlaceholderImage'

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

export default async function Home() {
  const { featuredListings, totalInvestment, totalDeals } = await getHomePageData()

  const stats = [
    { name: 'Total Investment', value: `$${(totalInvestment / 1000000).toFixed(1)}M` },
    { name: 'Successful Deals', value: totalDeals },
    { name: 'Countries', value: '12' },
    { name: 'Impact Projects', value: '200+' },
  ]

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate">
        <svg
          className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
          />
        </svg>
        <div className="overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
            <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
              <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Invest in Africa's Sustainable Future
                </h1>
                <p className="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                  Connect with vetted investment opportunities across Africa. From renewable energy to sustainable agriculture,
                  make an impact while earning competitive returns.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Link
                    href="/investments"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Browse Opportunities
                  </Link>
                  <Link href="/impact" className="text-sm font-semibold leading-6 text-gray-900">
                    View Impact <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
              <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                  <div className="relative">
                    <PlaceholderImage
                      src="/images/solar-farm.jpg"
                      alt="Solar farm in Africa"
                      className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                </div>
                <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                  <div className="relative">
                    <PlaceholderImage
                      src="/images/agriculture.jpg"
                      alt="Sustainable agriculture"
                      className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                  <div className="relative">
                    <PlaceholderImage
                      src="/images/community.jpg"
                      alt="Community impact"
                      className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Impact by the Numbers
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Together with our investors and project partners, we're building a sustainable and prosperous future for Africa.
          </p>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
          {stats.map((stat) => (
            <div key={stat.name} className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-50 p-8 sm:flex-row-reverse sm:items-end lg:flex-auto lg:flex-col lg:items-start">
              <p className="flex-none text-3xl font-bold tracking-tight text-gray-900">
                {stat.value}
              </p>
              <h3 className="text-sm font-semibold leading-6 text-gray-600">
                {stat.name}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Featured opportunities section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Featured Opportunities
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Explore our carefully selected investment opportunities that offer both financial returns and meaningful impact.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {featuredListings.map((listing) => (
            <article key={listing.id} className="flex flex-col items-start">
              <div className="relative w-full">
                <PlaceholderImage
                  src={listing.mediaUrls?.[0]}
                  alt={listing.title}
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time dateTime={listing.createdAt.toISOString()} className="text-gray-500">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </time>
                  <div className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                    {listing.sector}
                  </div>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <Link href={`/investments/${listing.id}`}>
                      <span className="absolute inset-0" />
                      {listing.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                    {listing.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* CTA section */}
      <div className="mx-auto mt-32 max-w-7xl sm:mt-40 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Make an Impact?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Join our community of impact investors and help build a sustainable future for Africa while earning competitive returns.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/auth/signup"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get Started Today
            </Link>
            <Link href="/investments" className="text-sm font-semibold leading-6 text-white">
              Browse Opportunities <span aria-hidden="true">→</span>
            </Link>
          </div>
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle cx={512} cy={512} r={512} fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  )
}
