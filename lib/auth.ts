import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret')

export async function createToken(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function getSession() {
  const token = cookies().get('crm_token')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as any
  } catch {
    return null
  }
}

export function hashPin(pin: string) {
  return Buffer.from(pin + (process.env.JWT_SECRET || 'salt')).toString('base64')
}

export function verifyPin(pin: string, hash: string) {
  return hashPin(pin) === hash
}
