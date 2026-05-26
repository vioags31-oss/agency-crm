'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ModelsPage() {
  const [models, setModels] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/models').then(r => r.json()).then(setModels)
  }, [])

  async function addModel(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/models', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) {
      const data = await res.json()
      setModels(prev => [...prev, data])
      setForm({ name: '', description: '' })
    }
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Link href="/admin" style={{ color: '#0066cc', marginBottom: 20, display: 'block' }}>← Назад</Link>
      <h1>💎 Моделі ({models.filter((m: any) => m.is_active).length})</h1>

      <form onSubmit={addModel} style={{ background: '#1a1a1a', padding: 20, borderRadius: 8, marginBottom: 30 }}>
        <h3>Додати модель</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
          <input placeholder="Назва" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            style={{ padding: 10, background: '#222', color: '#fff', border: 'none', borderRadius: 5 }} required />
          <input placeholder="Опис" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            style={{ padding: 10, background: '#222', color: '#fff', border: 'none', borderRadius: 5 }} />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: 15, padding: '10px 20px', background: '#0066cc', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' }}>
          {loading ? '...' : 'Додати'}
        </button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 15 }}>
        {models.filter((m: any) => m.is_active).map(m => (
          <div key={m.id} style={{ background: '#1a1a1a', padding: 20, borderRadius: 8 }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>💎</div>
            <h3>{m.name}</h3>
            {m.description && <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{m.description}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
