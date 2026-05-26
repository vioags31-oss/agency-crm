'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin', label: 'Дашборд', icon: '📊' },
    { href: '/admin/assistants', label: 'Асистенти', icon: '👤' },
    { href: '/admin/models', label: 'Моделі', icon: '💎' },
    { href: '/admin/clients', label: 'Клієнти', icon: '👥' },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 280,
        background: 'linear-gradient(135deg, #8B3FD4 0%, #5B2FA0 100%)',
        padding: '30px 0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
      }}>
        {/* Logo */}
        <div style={{
          padding: '0 20px',
          marginBottom: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{ fontSize: 28 }}>🎯</div>
          <h1 style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            color: '#fff',
          }}>
            CRM
          </h1>
        </div>

        {/* Navigation */}
        <nav>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 20px',
                color: isActive(item.href) ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                marginBottom: 8,
                borderLeft: isActive(item.href) ? '4px solid #fff' : '4px solid transparent',
                background: isActive(item.href) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                transition: 'all 0.2s ease',
                fontSize: 15,
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.href)) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  e.currentTarget.style.color = '#fff'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.href)) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
                }
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div style={{ padding: '0 20px', marginTop: 40 }}>
          <form action="/api/auth/logout" method="POST" style={{ margin: 0 }}>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 59, 48, 0.8)'
                e.currentTarget.style.borderColor = 'rgba(255, 59, 48, 1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
              }}
            >
              🚪 Вийти
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: 280,
        flex: 1,
        padding: '40px',
        background: '#0f0f0f',
        overflowY: 'auto',
      }}>
        {children}
      </main>
    </div>
  )
}
