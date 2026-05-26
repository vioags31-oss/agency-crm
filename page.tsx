'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AssistantPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [swaps, setSwaps] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [form, setForm] = useState({ client_telegram_username: '', model_id: '', notes: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`/api/swaps?assistant_id=${params.id}`).then(r => r.json()),
      fetch('/api/models').then(r => r.json()),
    ]).then(([s, m]) => {
      setSwaps(s)
      setModels(m)
    })
  }, [params.id])

  async function startSwap(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/swaps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assistant_id: params.id, ...form }),
    })
    setLoading(false)
    if (res.ok) {
      const data = await res.json()
      setSwaps(prev => [data, ...prev])
      setForm({ client_telegram_username: '', model_id: '', notes: '' })
    }
  }

  async function completeSwap(id: string) {
    const res = await fetch(`/api/swaps/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed', completed_at: new Date() }),
    })
    if (res.ok) {
      const data = await res.json()
      setSwaps(prev => prev.map(s => s.id === id ? data : s))
    }
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <button onClick={() => { fetch('/api/auth/logout', { method: 'POST' }).then(() => router.push('/')) }}
        style={{ padding: '10px 20px', background: '#cc0000', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer', marginBottom: 20 }}>
        Вийти
      </button>

      <h1>🔄 GG Swaps</h1>

      <form onSubmit={startSwap} style={{ background: '#1a1a1a', padding: 20, borderRadius: 8, marginBottom: 30 }}>
        <h3>Новий свап</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15 }}>
          <input placeholder="@client" value={form.client_telegram_username} onChange={e => setForm(f => ({ ...f, client_telegram_username: e.target.value }))}
            style={{ padding: 10, background: '#222', color: '#fff', border: 'none', borderRadius: 5 }} required />
          <select value={form.model_id} onChange={e => setForm(f => ({ ...f, model_id: e.target.value }))}
            style={{ padding: 10, background: '#222', color: '#fff', border: 'none', borderRadius: 5 }} required>
            <option value="">Модель...</option>
            {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <input placeholder="Нотатки" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            style={{ padding: 10, background: '#222', color: '#fff', border: 'none', borderRadius: 5 }} />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: 15, padding: '10px 20px', background: '#0066cc', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' }}>
          {loading ? '...' : 'Почати'}
        </button>
      </form>

      <div>
        <h3>Активні ({swaps.filter((s: any) => s.status === 'active').length})</h3>
        {swaps.filter((s: any) => s.status === 'active').map(s => (
          <div key={s.id} style={{ background: '#1a1a1a', padding: 15, borderRadius: 8, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>@{s.client_telegram_username}</strong> → {s.model_id}
              {s.notes && <div style={{ fontSize: 12, color: '#888' }}>📝 {s.notes}</div>}
            </div>
            <button onClick={() => completeSwap(s.id)} style={{ padding: '8px 16px', background: '#0f0', color: '#000', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold' }}>
              ✓ Готово
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
