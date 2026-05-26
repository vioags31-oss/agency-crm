'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pin }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Error')
      return
    }

    router.push(data.redirect)
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <h1>💎 Agency CRM</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <input
          type="text"
          placeholder="admin або @username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ padding: 10, fontSize: 16, background: '#222', color: '#fff', border: 'none', borderRadius: 5 }}
          required
        />
        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={e => setPin(e.target.value)}
          style={{ padding: 10, fontSize: 16, background: '#222', color: '#fff', border: 'none', borderRadius: 5 }}
          required
        />
        {error && <div style={{ color: '#ff4444' }}>{error}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{ padding: 12, fontSize: 16, background: '#0066cc', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' }}
        >
          {loading ? '...' : 'Увійти'}
        </button>
      </form>
    </div>
  )
}
