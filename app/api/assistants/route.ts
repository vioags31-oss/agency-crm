import { NextRequest, NextResponse } from 'next/server'
import { getSession, hashPin } from '@/lib/auth'
import { getAssistants, createAssistant, db } from '@/lib/firebase'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const data = await getAssistants()
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { name, telegram_username, pin } = await req.json()
    const tgUsername = telegram_username.replace('@', '')

    const existing = await db.collection('assistants').where('telegram_username', '==', tgUsername).limit(1).get()
    if (!existing.empty) return NextResponse.json({ error: 'Exists' }, { status: 409 })

    const data = await createAssistant({ name, telegram_username: tgUsername, pin: hashPin(pin), is_active: true })
    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
