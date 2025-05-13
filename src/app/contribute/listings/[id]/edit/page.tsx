import { prisma } from '@/lib/prisma'
import { ListingForm } from '@/components/ListingForm'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EditContributorListing({
  params,
}: PageProps) {
  const session = await getServerSession(authOptions)
  const { id } = await params
  
  if (!session || !['ADMIN', 'CONTRIBUTOR'].includes(session.user?.role as string)) {
    notFound()
  }

  const listing = await prisma.listing.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
  })

  if (!listing) {
    notFound()
  }

  const listingData = {
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
            Update the details of your investment listing
          </p>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <ListingForm
              initialData={listingData}
              isEdit={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}