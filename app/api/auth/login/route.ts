import { NextRequest, NextResponse } from 'next/server'
import { createToken, hashPin, verifyPin } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const { username, pin } = await req.json()

  // Admin check
  const adminUser = process.env.ADMIN_USERNAME || 'admin'
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123'

  if (username === adminUser && pin === adminPass) {
    const token = await createToken({ role: 'admin' })
    cookies().set('crm_token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 })
    return NextResponse.json({ redirect: '/admin' })
  }

  try {
    // Assistant check
    const tgUsername = username.startsWith('@') ? username.slice(1) : username
    const snap = await db.collection('assistants')
      .where('telegram_username', '==', tgUsername)
      .where('is_active', '==', true)
      .limit(1)
      .get()

    if (snap.empty) return NextResponse.json({ error: 'Invalid' }, { status: 401 })

    const asst = snap.docs[0].data() as any
    const id = snap.docs[0].id

    if (!verifyPin(pin, asst.pin)) return NextResponse.json({ error: 'Invalid' }, { status: 401 })

    const token = await createToken({ role: 'assistant', id, name: asst.name, tg: asst.telegram_username })
    cookies().set('crm_token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 })
    return NextResponse.json({ redirect: `/assistant/${id}` })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
