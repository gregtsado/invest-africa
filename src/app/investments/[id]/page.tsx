
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


export default async function InvestmentPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)
  const { id } = await params

  const listing = await prisma.listing.findUnique({
    where: { id },
  })

  if (!listing) {
    notFound()
  }

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {listing.title}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Investment Opportunity Details
          </p>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {/* Display listing details */}
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{listing.description}</dd>
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

              <div>
                <dt className="text-sm font-medium text-gray-500">Investment Size</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  ${listing.sizeMin.toLocaleString()} - ${listing.sizeMax.toLocaleString()}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Expected Return</dt>
                <dd className="mt-1 text-sm text-gray-900">{listing.returnPct}%</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Timeline</dt>
                <dd className="mt-1 text-sm text-gray-900">{listing.timeline}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Impact Metrics</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <ul className="list-disc pl-5 space-y-1">
                    {Object.entries(listing.impactMetrics as Record<string, any>).map(([key, value]) => (
                      <li key={key}>
                        {key}: {value}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>

              {listing.mediaUrls.length > 0 && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Media</dt>
                  <dd className="mt-1 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {listing.mediaUrls.map((url) => (
                      <div key={url} className="relative">
                        <img
                          src={url}
                          alt=""
                          className="h-24 w-full object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}