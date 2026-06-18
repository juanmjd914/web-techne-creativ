import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const NAV = [
  { to: '/', label: 'Inicio' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/por-que-nosotros', label: '¿Por qué nosotros?' },
  { to: '/proceso', label: 'Proceso' },
  { to: '/contacto', label: 'Contacto' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const solid = !isHome || scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: solid ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: solid ? 'blur(12px)' : 'none',
        borderBottom: solid ? '1px solid var(--tc-border)' : 'none',
        transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
        boxShadow: solid ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <nav style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src={solid ? '/logo-dark.png' : '/logo.png'}
            alt="Techne Creativ"
            style={{ height: 36, width: 'auto', transition: 'opacity 0.3s' }}
          />
        </Link>

        {/* Desktop nav */}
        <ul style={{ display: 'flex', alignItems: 'center', gap: 4, listStyle: 'none', margin: 0, padding: 0 }} className="desktop-nav">
          {NAV.map(n => (
            <li key={n.to}>
              <NavLink
                to={n.to}
                end={n.to === '/'}
                style={({ isActive }) => ({
                  padding: '6px 14px',
                  borderRadius: 6,
                  fontFamily: 'var(--font)',
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive ? 'var(--tc-primary)' : solid ? '#374151' : 'rgba(255,255,255,0.9)',
                  background: isActive ? 'var(--tc-primary-light)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'color 0.2s, background 0.2s',
                })}
              >
                {n.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link to="/agendar-cita" className="btn-teal" style={{ fontSize: 13, padding: '9px 20px' }}>
          Agendar cita
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Menu"
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#374151', padding: 4 }}
          className="mobile-toggle"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div style={{ background: '#fff', borderTop: '1px solid var(--tc-border)', padding: '16px 24px 24px' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {NAV.map(n => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  end={n.to === '/'}
                  style={({ isActive }) => ({
                    display: 'block',
                    padding: '10px 14px',
                    borderRadius: 8,
                    fontFamily: 'var(--font)',
                    fontSize: 15,
                    fontWeight: 500,
                    color: isActive ? 'var(--tc-primary)' : '#374151',
                    background: isActive ? 'var(--tc-primary-light)' : 'transparent',
                    textDecoration: 'none',
                  })}
                >
                  {n.label}
                </NavLink>
              </li>
            ))}
            <li style={{ marginTop: 12 }}>
              <Link to="/agendar-cita" className="btn-teal mobile-cta" style={{ width: '100%', justifyContent: 'center', fontSize: 14 }}>
                Agendar cita
              </Link>
            </li>
          </ul>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          header a.btn-teal:not(.mobile-cta) { display: none; }
          .mobile-toggle { display: flex !important; }
        }
        @media (min-width: 901px) {
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  )
}
