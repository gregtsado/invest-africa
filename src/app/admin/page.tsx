'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Listing {
  id: string
  title: string
  status: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'ARCHIVED'
  countryCode: string
  sector: string
  createdAt: Date
}

export default function AdminDashboard() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch('/api/admin/listings')
        if (!response.ok) throw new Error('Failed to fetch listings')
        const data = await response.json()
        setListings(data)
      } catch (err) {
        setError('Failed to load listings')
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [])

  async function handleStatusChange(id: string, newStatus: Listing['status']) {
    try {
      const response = await fetch(`/api/admin/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update status')

      setListings(listings.map(listing => 
        listing.id === id ? { ...listing, status: newStatus } : listing
      ))
    } catch (err) {
      setError('Failed to update listing status')
    }
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-600">{error}</div>

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-semibold leading-6 text-gray-900">Listings Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage investment opportunities and review submissions
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href="/admin/listings/new"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add Listing
            </Link>
          </div>
        </div>

        {/* Pending Approvals */}
        {listings.some(listing => listing.status === 'PENDING') && (
          <div className="mt-8">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Pending Approvals</h2>
            <div className="mt-4 ring-1 ring-gray-300 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Title</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Country</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sector</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {listings
                    .filter(listing => listing.status === 'PENDING')
                    .map((listing) => (
                      <tr key={listing.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {listing.title}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{listing.countryCode}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{listing.sector}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(listing.createdAt).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => handleStatusChange(listing.id, 'ACTIVE')}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(listing.id, 'DRAFT')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* All Listings */}
        <div className="mt-8">
          <h2 className="text-base font-semibold leading-7 text-gray-900">All Listings</h2>
          <div className="mt-4 ring-1 ring-gray-300 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Title</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Country</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sector</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {listings.map((listing) => (
                  <tr key={listing.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
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
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{listing.countryCode}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{listing.sector}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link
                        href={`/admin/listings/${listing.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleStatusChange(listing.id, 'ARCHIVED')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Archive
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}