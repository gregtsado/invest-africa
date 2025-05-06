'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ListingFormProps {
  initialData?: {
    id?: string
    title: string
    description: string
    countryCode: string
    sector: string
    sizeMin: number
    sizeMax: number
    returnPct: number
    timeline: string
    impactMetrics: Record<string, any>
    mediaUrls: string[]
  }
  isEdit?: boolean
}

export function ListingForm({ initialData, isEdit = false }: ListingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    countryCode: initialData?.countryCode || '',
    sector: initialData?.sector || '',
    sizeMin: initialData?.sizeMin || 0,
    sizeMax: initialData?.sizeMax || 0,
    returnPct: initialData?.returnPct || 0,
    timeline: initialData?.timeline || '',
    impactMetrics: initialData?.impactMetrics || {},
    mediaUrls: initialData?.mediaUrls || [],
  })

  // Common sectors for investment opportunities
  const sectors = [
    'Agriculture',
    'Clean Energy',
    'Education',
    'Healthcare',
    'Infrastructure',
    'Manufacturing',
    'Technology',
    'Other'
  ]

  // African countries
  const countries = [
    'KE', 'NG', 'ZA', 'EG', 'GH', 'ET', 'TZ', 'UG', 'RW', 'SN',
    'Other'
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isEdit
        ? `/api/admin/listings/${initialData?.id}`
        : '/api/admin/listings'
      
      const method = isEdit ? 'PATCH' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'DRAFT',
        }),
      })

      if (!response.ok) throw new Error('Failed to save listing')

      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError('Failed to save listing')
      setLoading(false)
    }
  }

  function handleImpactMetricChange(key: string, value: string) {
    setFormData(prev => ({
      ...prev,
      impactMetrics: {
        ...prev.impactMetrics,
        [key]: value,
      },
    }))
  }

  function handleMediaUrlChange(index: number, value: string) {
    const newUrls = [...formData.mediaUrls]
    newUrls[index] = value
    setFormData(prev => ({
      ...prev,
      mediaUrls: newUrls,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-6 pt-8">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Basic Information
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Provide the main details about this investment opportunity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="sector" className="block text-sm font-medium text-gray-700">
                Sector
              </label>
              <div className="mt-1">
                <select
                  id="sector"
                  name="sector"
                  value={formData.sector}
                  onChange={e => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a sector</option>
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <div className="mt-1">
                <select
                  id="countryCode"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={e => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-8">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Investment Details
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="sizeMin" className="block text-sm font-medium text-gray-700">
                Minimum Investment ($)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="sizeMin"
                  id="sizeMin"
                  value={formData.sizeMin}
                  onChange={e => setFormData(prev => ({ ...prev, sizeMin: parseFloat(e.target.value) }))}
                  required
                  min="0"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="sizeMax" className="block text-sm font-medium text-gray-700">
                Maximum Investment ($)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="sizeMax"
                  id="sizeMax"
                  value={formData.sizeMax}
                  onChange={e => setFormData(prev => ({ ...prev, sizeMax: parseFloat(e.target.value) }))}
                  required
                  min="0"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="returnPct" className="block text-sm font-medium text-gray-700">
                Expected Return (%)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="returnPct"
                  id="returnPct"
                  value={formData.returnPct}
                  onChange={e => setFormData(prev => ({ ...prev, returnPct: parseFloat(e.target.value) }))}
                  required
                  min="0"
                  max="100"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
                Investment Timeline
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="timeline"
                  id="timeline"
                  value={formData.timeline}
                  onChange={e => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                  required
                  placeholder="e.g., 24 months"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-8">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Impact Metrics
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Define the social and environmental impact metrics for this investment.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Jobs Created
                </label>
                <input
                  type="text"
                  value={formData.impactMetrics.jobsCreated || ''}
                  onChange={e => handleImpactMetricChange('jobsCreated', e.target.value)}
                  placeholder="e.g., 100"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CO2 Reduction (tons/year)
                </label>
                <input
                  type="text"
                  value={formData.impactMetrics.co2Reduction || ''}
                  onChange={e => handleImpactMetricChange('co2Reduction', e.target.value)}
                  placeholder="e.g., 1000"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-8">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Media
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Add media URLs for project images and documents.
            </p>
          </div>

          <div className="space-y-4">
            {[0, 1, 2].map((index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700">
                  Media URL {index + 1}
                </label>
                <input
                  type="url"
                  value={formData.mediaUrls[index] || ''}
                  onChange={e => handleMediaUrlChange(index, e.target.value)}
                  placeholder="https://"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Listing' : 'Create Listing'}
          </button>
        </div>
      </div>
    </form>
  )
}