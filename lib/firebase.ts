import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

let adminApp = getApps()[0]
if (!adminApp) {
  adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

export const db = getFirestore(adminApp)

// Assistants
export async function getAssistants() {
  const snap = await db.collection('assistants').orderBy('created_at', 'desc').get()
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getAssistantById(id: string) {
  const doc = await db.collection('assistants').doc(id).get()
  return doc.exists ? { id: doc.id, ...doc.data() } : null
}

export async function createAssistant(data: any) {
  const ref = db.collection('assistants').doc()
  await ref.set({ ...data, created_at: new Date() })
  return { id: ref.id, ...data }
}

export async function updateAssistant(id: string, data: any) {
  await db.collection('assistants').doc(id).update(data)
  const doc = await db.collection('assistants').doc(id).get()
  return { id, ...doc.data() }
}

export async function deleteAssistant(id: string) {
  await db.collection('assistants').doc(id).delete()
  const swaps = await db.collection('swaps').where('assistant_id', '==', id).get()
  swaps.docs.forEach(d => d.ref.delete())
}

// Models
export async function getModels() {
  const snap = await db.collection('models').orderBy('name').get()
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getModelById(id: string) {
  const doc = await db.collection('models').doc(id).get()
  return doc.exists ? { id: doc.id, ...doc.data() } : null
}

export async function createModel(data: any) {
  const ref = db.collection('models').doc()
  await ref.set({ ...data, created_at: new Date() })
  return { id: ref.id, ...data }
}

export async function updateModel(id: string, data: any) {
  await db.collection('models').doc(id).update(data)
  const doc = await db.collection('models').doc(id).get()
  return { id, ...doc.data() }
}

// Swaps
export async function getSwaps(filters?: any) {
  let query = db.collection('swaps').orderBy('started_at', 'desc')
  if (filters?.assistant_id) query = query.where('assistant_id', '==', filters.assistant_id)
  if (filters?.status) query = query.where('status', '==', filters.status)
  if (filters?.client) query = query.where('client_telegram_username', '==', filters.client)

  const snap = await query.get()
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function createSwap(data: any) {
  const existing = await db.collection('swaps')
    .where('client_telegram_username', '==', data.client_telegram_username)
    .where('status', '==', 'active')
    .limit(1)
    .get()

  if (!existing.empty) throw { code: 'CONFLICT', message: 'Client in active swap' }

  const ref = db.collection('swaps').doc()
  await ref.set({ ...data, started_at: new Date(), completed_at: null })
  return { id: ref.id, ...data }
}

export async function updateSwap(id: string, data: any) {
  await db.collection('swaps').doc(id).update(data)
  const doc = await db.collection('swaps').doc(id).get()
  return { id, ...doc.data() }
}
