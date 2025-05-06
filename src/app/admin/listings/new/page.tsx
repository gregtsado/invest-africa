import { ListingForm } from '@/components/ListingForm'

export default function NewListing() {
  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create New Investment Opportunity
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below to create a new investment listing.
          </p>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <ListingForm />
          </div>
        </div>
      </div>
    </div>
  )
}