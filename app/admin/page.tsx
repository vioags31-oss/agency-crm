import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getAssistants, getModels, getSwaps } from '@/lib/firebase'

// Admin dashboard - displays key metrics and statistics
export default async function AdminPage() {
  const session = await getSession()
  if (!session || session.role !== 'admin') redirect('/login')

  const [assistants, models, swaps] = await Promise.all([
    getAssistants(),
    getModels(),
    getSwaps(),
  ])

  const stats = [
    {
      icon: '👤',
      label: 'Асистентів',
      value: assistants.filter((a: any) => a.is_active).length,
      color: '#8B3FD4',
    },
    {
      icon: '💎',
      label: 'Моделей',
      value: models.filter((m: any) => m.is_active).length,
      color: '#FF6B9D',
    },
    {
      icon: '🔄',
      label: 'Активних',
      value: swaps.filter((s: any) => s.status === 'active').length,
      color: '#00D9FF',
    },
    {
      icon: '✅',
      label: 'Завершених',
      value: swaps.filter((s: any) => s.status === 'completed').length,
      color: '#00FF88',
    },
  ]

  return (
    <div>
      <h1 style={{ margin: '0 0 30px 0', fontSize: 32, fontWeight: 700 }}>
        📊 Dashboard - VERCEL TEST
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 20,
        marginBottom: 40,
      }}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: 24,
              borderRadius: 12,
              border: `2px solid ${stat.color}33`,
              boxShadow: `0 4px 12px ${stat.color}15`,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = `0 8px 24px ${stat.color}25`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = `0 4px 12px ${stat.color}15`
            }}
          >
            <div style={{
              fontSize: 40,
              marginBottom: 12,
            }}>
              {stat.icon}
            </div>
            <div style={{
              fontSize: 28,
              fontWeight: 700,
              color: stat.color,
              marginBottom: 8,
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: 13,
              color: '#aaa',
              fontWeight: 500,
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* R