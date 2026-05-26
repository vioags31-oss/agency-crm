import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getAssistants, getModels, getSwaps } from '@/lib/firebase'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await getSession()
  if (!session || session.role !== 'admin') redirect('/login')

  const [assistants, models, swaps] = await Promise.all([
    getAssistants(),
    getModels(),
    getSwaps(),
  ])

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1>📊 Admin Дашборд</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 15, marginBottom: 30 }}>
        <div style={{ background: '#1a1a1a', padding: 20, borderRadius: 8 }}>
          <div style={{ fontSize: 32 }}>👤</div>
          <div style={{ fontSize: 24, marginTop: 10 }}>{assistants.filter((a: any) => a.is_active).length}</div>
          <div style={{ fontSize: 12, color: '#888' }}>Асистентів</div>
        </div>
        <div style={{ background: '#1a1a1a', padding: 20, borderRadius: 8 }}>
          <div style={{ fontSize: 32 }}>💎</div>
          <div style={{ fontSize: 24, marginTop: 10 }}>{models.filter((m: any) => m.is_active).length}</div>
          <div style={{ fontSize: 12, color: '#888' }}>Моделей</div>
        </div>
        <div style={{ background: '#1a1a1a', padding: 20, borderRadius: 8 }}>
          <div style={{ fontSize: 32 }}>🔄</div>
          <div style={{ fontSize: 24, marginTop: 10 }}>{swaps.filter((s: any) => s.status === 'active').length}</div>
          <div style={{ fontSize: 12, color: '#888' }}>Активних</div>
        </div>
        <div style={{ background: '#1a1a1a', padding: 20, borderRadius: 8 }}>
          <div style={{ fontSize: 32 }}>📋</div>
          <div style={{ fontSize: 24, marginTop: 10 }}>{swaps.length}</div>
          <div style={{ fontSize: 12, color: '#888' }}>Всього</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
        <Link href="/admin/assistants" style={{ padding: '10px 20px', background: '#0066cc', color: '#fff', textDecoration: 'none', borderRadius: 5 }}>
          Асистенти
        </Link>
        <Link href="/admin/models" style={{ padding: '10px 20px', background: '#0066cc', color: '#fff', textDecoration: 'none', borderRadius: 5 }}>
          Моделі
        </Link>
        <form action="/api/auth/logout" method="POST" style={{ display: 'inline' }}>
          <button type="submit" style={{ padding: '10px 20px', background: '#cc0000', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' }}>
            Вийти
          </button>
        </form>
      </div>
    </div>
  )
}
