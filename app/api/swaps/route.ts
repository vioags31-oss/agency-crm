import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getSwaps, createSwap } from '@/lib/firebase'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const filters = {
      assistant_id: searchParams.get('assistant_id') || undefined,
      status: searchParams.get('status') || undefined,
      client: searchParams.get('client') || undefined,
    }
    const data = await getSwaps(filters)
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { assistant_id, model_id, client_telegram_username, notes } = await req.json()
    const data = await createSwap({
      assistant_id,
      model_id,
      client_telegram_username: client_telegram_username.replace('@', ''),
      notes: notes || null,
      status: 'active',
    })
    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    if (err.code === 'CONFLICT') {
      return NextResponse.json({ error: err.message }, { status: 409 })
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
