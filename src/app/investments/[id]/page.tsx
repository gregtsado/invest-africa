'use client'

import React from 'react';
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, use } from 'react';
import Image from 'next/image';

interface Listing {
  id: string
  title: string
  description: string
  countryCode: string
  sector: string
  sizeMin: number
  sizeMax: number
  returnPct: number
  timeline: string
  impactMetrics: any
  mediaUrls: string[]
  createdAt: Date
}

export default function InvestmentDetail(
  props: {
    params: Promise<{ id: string }>
  }
) {
  const params = use(props.params);
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [listing, setListing] = useState<Listing | null>(null)
  const [selectedOption, setSelectedOption] = useState<'SELF' | 'MANAGED' | 'FUND' | null>(null)
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')

  // Fetch listing data
  React.useEffect(() => {
    async function fetchListing() {
      try {
        const response = await fetch(`/api/listings/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch listing')
        const data = await response.json()
        setListing(data)
      } catch (err) {
        setError('Failed to load investment opportunity')
      }
    }
    fetchListing()
  }, [params.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedOption || !amount) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/engagement-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: params.id,
          type: selectedOption,
          amount: parseFloat(amount),
          details: notes,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit request')

      router.push('/dashboard')
    } catch (err) {
      setError('Failed to submit investment request')
      setLoading(false)
    }
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            {error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Project Overview */}
        <div className="lg:flex lg:items-start lg:gap-x-12">
          <div className="lg:w-2/3">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {listing.title}
            </h1>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-sm font-medium text-indigo-700">
                {listing.sector}
              </span>
              <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600">
                {listing.countryCode}
              </span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="text-base font-semibold text-gray-900">Investment Size</h3>
                <p className="mt-2 text-2xl font-bold text-indigo-600">
                  ${listing.sizeMin.toLocaleString()} - ${listing.sizeMax.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="text-base font-semibold text-gray-900">Expected Return</h3>
                <p className="mt-2 text-2xl font-bold text-indigo-600">
                  {listing.returnPct}%
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="text-base font-semibold text-gray-900">Timeline</h3>
                <p className="mt-2 text-2xl font-bold text-indigo-600">
                  {listing.timeline}
                </p>
              </div>
            </div>

            <div className="mt-8 prose prose-indigo max-w-none">
              <h2>Project Description</h2>
              <p>{listing.description}</p>

              <h2>Impact Metrics</h2>
              <ul>
                {Object.entries(listing.impactMetrics).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {String(value)} {/* Cast value to string explicitly */}
                  </li>
                ))}
              </ul>
            </div>

            {listing.mediaUrls.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900">Gallery</h2>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {listing.mediaUrls.map((url, index) => (
                    <Image
                      key={index}
                      src={url}
                      alt={`Project image ${index + 1}`}
                      className="rounded-lg object-cover"
                      width={500}
                      height={300}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Investment Options */}
          <div className="mt-8 lg:mt-0 lg:w-1/3">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="text-lg font-semibold text-gray-900">Investment Options</h2>
              
              {!session ? (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Please sign in to invest in this opportunity
                  </p>
                  <Link
                    href="/auth/signin"
                    className="mt-4 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div>
                    <label className="text-base font-semibold text-gray-900">
                      Select Investment Type
                    </label>
                    <fieldset className="mt-2">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            id="self"
                            name="investmentType"
                            type="radio"
                            checked={selectedOption === 'SELF'}
                            onChange={() => setSelectedOption('SELF')}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <label htmlFor="self" className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                            Self-Invest
                            <span className="block text-sm text-gray-500">Direct investment with project contact</span>
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="managed"
                            name="investmentType"
                            type="radio"
                            checked={selectedOption === 'MANAGED'}
                            onChange={() => setSelectedOption('MANAGED')}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <label htmlFor="managed" className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                            Managed Investment
                            <span className="block text-sm text-gray-500">Professional portfolio management</span>
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="fund"
                            name="investmentType"
                            type="radio"
                            checked={selectedOption === 'FUND'}
                            onChange={() => setSelectedOption('FUND')}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <label htmlFor="fund" className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                            Impact-Focused Fund
                            <span className="block text-sm text-gray-500">Pooled investment for impact</span>
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>

                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Investment Amount ($)
                    </label>
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min={listing.sizeMin}
                      max={listing.sizeMax}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Additional Notes
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !selectedOption}
                    className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Investment Request'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}