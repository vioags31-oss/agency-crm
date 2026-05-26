import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getModels, createModel } from '@/lib/firebase'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const data = await getModels()
    return NextResponse.json(data.filter((m: any) => m.is_active))
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { name, description } = await req.json()
    const data = await createModel({ name, description: description || null, is_active: true })
    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
