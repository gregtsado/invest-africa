import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

type Context = {
  params: Promise<{ id: string }>
}

export async function GET(
  req: NextRequest,
  context: Context
) {
  try {
    const { id } = await context.params
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