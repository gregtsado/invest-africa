'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Listing {
  id: string
  title: string
  description: string
  status: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'ARCHIVED'
  countryCode: string
  sector: string
  createdAt: Date
}

export default function ContributorDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch('/api/contributor/listings')
        if (!response.ok) throw new Error('Failed to fetch listings')
        const data = await response.json()
        setListings(data)
      } catch (err) {
        setError('Failed to load listings')
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.role === 'CONTRIBUTOR') {
      fetchListings()
    } else if (session && session.user?.role !== 'CONTRIBUTOR') {
      router.push('/dashboard')
    }
  }, [session, router])

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Please sign in to access your contributor dashboard
        </h1>
        <Link
          href="/auth/signin"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign in
        </Link>
      </div>
    )
  }

  if (session.user?.role !== 'CONTRIBUTOR') {
    return null // Router will handle redirect
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>
  }

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-semibold leading-6 text-gray-900">
              My Investment Opportunities
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage and track your submitted investment opportunities
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0">
            <Link
              href="/contribute/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add New Opportunity
            </Link>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Country
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Sector
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Created
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {listings.map((listing) => (
                    <tr key={listing.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {listing.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          listing.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          listing.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          listing.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {listing.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {listing.countryCode}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {listing.sector}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <Link
                          href={`/contribute/listings/${listing.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </Link>
                        {listing.status === 'ACTIVE' && (
                          <Link
                            href={`/investments/${listing.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {listings.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-sm text-gray-500">You haven't created any investment opportunities yet</p>
                  <Link
                    href="/contribute/new"
                    className="mt-4 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Create your first listing <span aria-hidden="true"> →</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}