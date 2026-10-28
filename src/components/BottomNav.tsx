import { useLocation, useNavigate } from 'react-router-dom'

const BRAND = '#E05C00'

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const items = [
    {
      label: 'Erkunden',
      path: '/',
      exact: true,
      icon: (active: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? BRAND : '#999'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
      ),
    },
    {
      label: 'Für dich',
      path: '/results',
      exact: false,
      icon: (active: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? BRAND : '#999'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12z"/>
          <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"/>
        </svg>
      ),
    },
    {
      label: 'Händler',
      path: '/dashboard',
      exact: false,
      icon: (active: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? BRAND : '#999'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 3h16v16l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5V3z"/>
          <line x1="8" y1="9" x2="16" y2="9"/>
          <line x1="8" y1="13" x2="14" y2="13"/>
        </svg>
      ),
    },
    {
      label: 'Account',
      path: '/account',
      exact: false,
      icon: (active: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? BRAND : '#999'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11L12 3l9 8"/>
          <path d="M5 10v9h5v-5h4v5h5v-9"/>
        </svg>
      ),
    },
  ]

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 flex"
      style={{ height: 54 }}
    >
      {items.map((item) => {
        const active = item.exact
          ? location.pathname === item.path
          : location.pathname.startsWith(item.path)
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5"
          >
            {item.icon(active)}
            <span
              className="text-[9px]"
              style={{ color: active ? BRAND : '#999', fontWeight: active ? 700 : 500 }}
            >
              {item.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
