import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react'

const LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/por-que-nosotros', label: '¿Por qué nosotros?' },
  { to: '/proceso', label: 'Proceso' },
  { to: '/contacto', label: 'Contacto' },
  { to: '/agendar-cita', label: 'Agendar cita' },
]

export function Footer() {
  return (
    <footer style={{ background: '#0F172A', color: '#CBD5E1' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40 }}>
        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <img src="/logo.png" alt="Techne Creativ" style={{ height: 40, width: 'auto', maxWidth: 160 }} />
          <p style={{ fontSize: 13, lineHeight: 1.7, color: '#94A3B8' }}>
            Agencia de marketing digital y diseño web con sede en Rancagua, Chile. Potenciamos negocios con estrategia, diseño y tecnología.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            {[
              { href: 'https://www.instagram.com/technecreativ', icon: <Instagram size={16} />, label: 'Instagram' },
              { href: 'https://www.facebook.com/technecreativ', icon: <Facebook size={16} />, label: 'Facebook' },
              { href: 'https://x.com/technecreativ', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117Z"/></svg>, label: 'X' },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1', textDecoration: 'none', transition: 'background 0.2s' }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00BCD4', marginBottom: 16 }}>Navegación</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {LINKS.map(l => (
              <li key={l.to}>
                <Link to={l.to} style={{ fontSize: 14, color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00BCD4', marginBottom: 16 }}>Contacto</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: <Mail size={14} />, text: 'ventas@technecreativ.com', href: 'mailto:ventas@technecreativ.com' },
              { icon: <Phone size={14} />, text: '+56 9 6517 4454 (Chile)', href: 'https://wa.me/56965174454' },
              { icon: <Phone size={14} />, text: '+58 412 476 0407 (Venezuela)', href: 'https://wa.me/584124760407' },
              { icon: <MapPin size={14} />, text: 'Rancagua, O\'Higgins, Chile' },
            ].map((c, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: '#00BCD4', marginTop: 1, flexShrink: 0 }}>{c.icon}</span>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none', lineHeight: 1.5 }}>{c.text}</a>
                ) : (
                  <span style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5 }}>{c.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00BCD4', marginBottom: 0 }}>¿Listo para crecer?</p>
          <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7 }}>
            Agenda una cita gratuita y cuéntanos sobre tu proyecto. Sin compromiso.
          </p>
          <Link to="/agendar-cita" className="btn-teal" style={{ alignSelf: 'flex-start', fontSize: 13 }}>
            Agendar cita gratis
          </Link>
          <a href="https://wa.me/56965174454?text=Hola%2C%20quiero%20información%20sobre%20sus%20servicios" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 13, color: '#25D366', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', maxWidth: 1200, margin: '0 auto', padding: '24px 24px', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>
          © {new Date().getFullYear()} Techne Creativ — Todos los derechos reservados
        </p>
        <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>
          Desarrollado por <a href="https://technecreativ.com" target="_blank" rel="noopener noreferrer" style={{ color: '#00BCD4', textDecoration: 'none' }}>Techne Creativ</a>
        </p>
      </div>
    </footer>
  )
}
