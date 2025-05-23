import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

type RouteParams = Promise<{ id: string }>

export async function GET(
  req: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params
    const listing = await prisma.listing.findUnique({
      where: { id },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(listing)
  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}