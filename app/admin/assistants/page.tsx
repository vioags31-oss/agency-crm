'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AssistantsPage() {
  const [assistants, setAssistants] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', telegram_username: '', pin: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/assistants').then(r => r.json()).then(setAssistants)
  }, [])

  async function addAssistant(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/assistants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) {
      const data = await res.json()
      setAssistants(prev => [data, ...prev])
      setForm({ name: '', telegram_username: '', pin: '' })
    }
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Link href="/admin" style={{ color: '#0066cc', marginBottom: 20, display: 'block' }}>← Назад</Link>
      <h1>👤 Асистенти ({assistants.length})</h1>

      <form onSubmit={addAssistant} style={{ background: '#1a1a1a', padding: 20, borderRadius: 8, marginBottom: 30 }}>
        <h3>Додати асистента</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15 }}>
          <input placeholder="Ім'я" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            style={{ padding: 10, background: '#222', color: '#fff', border: 'none', borderRadius: 5 }} required />
          <input placeholder="@telegram" value={form.telegram_username} onChange={e => setForm(f => ({ ...f, telegram_username: e.target.value }))}
            style={{ padding: 10, background: '#222', color: '#fff', border: 'none', borderRadius: 5 }} required />
          <input type="password" placeholder="PIN" value={form.pin} onChange={e => setForm(f => ({ ...f, pin: e.target.value }))}
            style={{ padding: 10, background: '#222', color: '#fff', border: 'none', borderRadius: 5 }} required />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: 15, padding: '10px 20px', background: '#0066cc', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' }}>
          {loading ? '...' : 'Додати'}
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #333' }}>
            <th style={{ textAlign: 'left', padding: 10 }}>Ім'я</th>
            <th style={{ textAlign: 'left', padding: 10 }}>Telegram</th>
            <th style={{ textAlign: 'left', padding: 10 }}>Статус</th>
          </tr>
        </thead>
        <tbody>
          {assistants.map(a => (
            <tr key={a.id} style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: 10 }}>{a.name}</td>
              <td style={{ padding: 10 }}>@{a.telegram_username}</td>
              <td style={{ padding: 10, color: a.is_active ? '#0f0' : '#f00' }}>{a.is_active ? '✓' : '✗'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
