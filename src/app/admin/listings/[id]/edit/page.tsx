import { prisma } from '@/lib/prisma'
import { ListingForm } from '@/components/ListingForm'
import { notFound } from 'next/navigation'
import { Prisma } from '@prisma/client'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditListing({
  params,
}: PageProps) {
  const { id } = await params
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      countryCode: true,
      sector: true,
      sizeMin: true,
      sizeMax: true,
      returnPct: true,
      timeline: true,
      impactMetrics: true,
      mediaUrls: true,
    },
  })

  if (!listing) {
    notFound()
  }

  // Cast the JSON value to Record<string, any>
  const formattedListing = {
    ...listing,
    impactMetrics: listing.impactMetrics as Record<string, any>,
  }

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Edit Investment Opportunity
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Update the details of this investment listing.
          </p>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <ListingForm
              initialData={formattedListing}
              isEdit={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}