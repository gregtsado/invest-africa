import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Prisma } from '@prisma/client'

interface SearchParamsType {
  country?: string
  sector?: string
  minSize?: string
  maxSize?: string
  minReturn?: string // Added minReturn
  sort?: string
  page?: string
  limit?: string
  q?: string
  mode?: 'insensitive' | 'default'
}

async function getListings(searchParams: SearchParamsType) {
  const where: Prisma.ListingWhereInput = {
    status: 'ACTIVE',
    ...(searchParams.country && { countryCode: searchParams.country }),
    ...(searchParams.sector && { sector: searchParams.sector }),
    ...(searchParams.minSize && { sizeMin: { gte: parseFloat(searchParams.minSize) } }),
    ...(searchParams.maxSize && { sizeMax: { lte: parseFloat(searchParams.maxSize) } }),
    ...(searchParams.q && {
      OR: [
        { title: { contains: searchParams.q, mode: Prisma.QueryMode.insensitive } },
        { description: { contains: searchParams.q, mode: Prisma.QueryMode.insensitive } },
      ],
    }),
  }

  return await prisma.listing.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
}

async function getFilters() {
  const [countries, sectors] = await Promise.all([
    prisma.listing.findMany({
      where: { status: 'ACTIVE' },
      select: { countryCode: true },
      distinct: ['countryCode'],
    }),
    prisma.listing.findMany({
      where: { status: 'ACTIVE' },
      select: { sector: true },
      distinct: ['sector'],
    }),
  ])

  return {
    countries: countries.map(c => c.countryCode),
    sectors: sectors.map(s => s.sector),
  }
}

export default async function Investments(
  props: {
    searchParams: Promise<SearchParamsType>
  }
) {
  const resolvedSearchParams = await props.searchParams
  const [listings, filters] = await Promise.all([
    getListings(resolvedSearchParams),
    getFilters(),
  ])

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Investment Opportunities
          </h1>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Browse and filter investment opportunities across Africa
          </p>
        </div>

        {/* Filters */}
        <form className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              id="country"
              name="country"
              defaultValue={resolvedSearchParams.country}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Countries</option>
              {filters.countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sector" className="block text-sm font-medium text-gray-700">
              Sector
            </label>
            <select
              id="sector"
              name="sector"
              defaultValue={resolvedSearchParams.sector}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Sectors</option>
              {filters.sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="minSize" className="block text-sm font-medium text-gray-700">
              Minimum Investment
            </label>
            <input
              type="number"
              id="minSize"
              name="minSize"
              defaultValue={resolvedSearchParams.minSize}
              placeholder="Min $"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="minReturn" className="block text-sm font-medium text-gray-700">
              Minimum Return %
            </label>
            <input
              type="number"
              id="minReturn"
              name="minReturn"
              defaultValue={resolvedSearchParams.minReturn}
              placeholder="Min %"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              id="search"
              name="search"
              defaultValue={resolvedSearchParams.q}
              placeholder="Search opportunities..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Apply Filters
            </button>
          </div>
        </form>

        {/* Listings grid */}
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <article key={listing.id} className="flex flex-col items-start">
              <div className="w-full">
                <div className="flex items-center gap-x-4 text-xs">
                  <time dateTime={listing.createdAt.toISOString()} className="text-gray-500">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </time>
                  <span className="relative z-10 rounded-full bg-indigo-50 px-3 py-1.5 font-medium text-indigo-600">
                    {listing.sector}
                  </span>
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
                <div className="mt-4 flex flex-wrap gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Investment Size</p>
                    <p className="text-sm text-gray-600">
                      ${listing.sizeMin.toLocaleString()} - ${listing.sizeMax.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Expected Return</p>
                    <p className="text-sm text-gray-600">{listing.returnPct}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Country</p>
                    <p className="text-sm text-gray-600">{listing.countryCode}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {listings.length === 0 && (
          <div className="mt-16 text-center">
            <h3 className="text-lg font-semibold text-gray-900">No opportunities found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}