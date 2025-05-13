import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Prisma } from '@prisma/client'

interface SearchParams {
  country?: string
  sector?: string
  minSize?: string
  maxSize?: string
  minReturn?: string
  search?: string
}

type PageProps = {
  searchParams: Promise<SearchParams>
}

async function getListings(searchParams: SearchParams) {
  const where: Prisma.ListingWhereInput = {
    status: 'ACTIVE',
    ...(searchParams.country && { countryCode: searchParams.country }),
    ...(searchParams.sector && { sector: searchParams.sector }),
    ...(searchParams.minSize && { 
      sizeMin: { gte: parseFloat(searchParams.minSize) }
    }),
    ...(searchParams.maxSize && { 
      sizeMax: { lte: parseFloat(searchParams.maxSize) }
    }),
    ...(searchParams.minReturn && { 
      returnPct: { gte: parseFloat(searchParams.minReturn) }
    }),
    ...(searchParams.search && {
      OR: [
        { 
          title: { 
            contains: searchParams.search,
            mode: 'insensitive' as Prisma.QueryMode
          }
        },
        { 
          description: { 
            contains: searchParams.search,
            mode: 'insensitive' as Prisma.QueryMode
          }
        },
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

export default async function InvestmentsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams
  const [listings, filters] = await Promise.all([
    getListings(params),
    getFilters(),
  ])

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Investment Opportunities
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Browse and filter available investment opportunities
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Filters */}
          <div className="lg:col-span-1">
            <form className="space-y-6">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  defaultValue={params.country}
                >
                  <option value="">All Countries</option>
                  {filters.countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add other filters similarly */}
            </form>
          </div>

          {/* Listings */}
          <div className="lg:col-span-2">
            <div className="grid gap-6 sm:grid-cols-2">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/investments/${listing.id}`}
                  className="block rounded-lg border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    {listing.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {listing.description}
                  </p>
                  <dl className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Size</dt>
                      <dd className="text-sm text-gray-900">
                        ${listing.sizeMin.toLocaleString()} - ${listing.sizeMax.toLocaleString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Return</dt>
                      <dd className="text-sm text-gray-900">{listing.returnPct}%</dd>
                    </div>
                  </dl>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}