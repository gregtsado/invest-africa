import { ListingForm } from '@/components/ListingForm'

export default function NewContributorListing() {
  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Submit Investment Opportunity
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Share your project with potential investors. All submissions will be reviewed before being published.
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