import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await req.json()
    const { listingId, type, amount, details } = data

    // Validate input
    if (!listingId || !type || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create engagement request
    const request = await prisma.engagementRequest.create({
      data: {
        type,
        amount,
        details,
        status: 'PENDING',
        listingId,
        userId: session.user?.id,
      },
    })

    return NextResponse.json(request, { status: 201 })
  } catch (error) {
    console.error('Error creating engagement request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}