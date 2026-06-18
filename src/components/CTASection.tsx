import { Link } from 'react-router-dom'
import { ArrowRight, CalendarCheck } from 'lucide-react'

interface CTASectionProps {
  title?: string
  subtitle?: string
  primaryLabel?: string
  primaryTo?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryTo?: string
  secondaryHref?: string
}

export function CTASection({
  title = '¿Listo para llevar tu negocio al siguiente nivel?',
  subtitle = 'Agenda una cita gratuita y cuéntanos sobre tu proyecto. Sin compromisos, solo resultados.',
  primaryLabel = 'Agendar cita gratis',
  primaryTo = '/agendar-cita',
  primaryHref,
  secondaryLabel = 'Ver nuestros servicios',
  secondaryTo,
  secondaryHref = '/servicios',
}: CTASectionProps) {
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="cta-card">
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #0BBEC8, #0CC4A0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <CalendarCheck size={28} />
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--tc-text)', lineHeight: 1.2, maxWidth: 560, textAlign: 'center' }}>
            {title}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--tc-muted)', maxWidth: 480, textAlign: 'center', lineHeight: 1.7 }}>
            {subtitle}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {primaryHref
              ? <a href={primaryHref} target="_blank" rel="noopener noreferrer" className="btn-teal">{primaryLabel} <ArrowRight size={16} /></a>
              : <Link to={primaryTo!} className="btn-teal">{primaryLabel} <ArrowRight size={16} /></Link>
            }
            {secondaryTo
              ? <Link to={secondaryTo} className="btn-outline">{secondaryLabel}</Link>
              : <a href={secondaryHref} className="btn-outline">{secondaryLabel}</a>
            }
          </div>
        </div>
      </div>
    </section>
  )
}
