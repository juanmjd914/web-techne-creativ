import { useState, useEffect } from 'react'
import { LogIn, Calendar, MessageSquare, CheckCircle, Clock, XCircle, RefreshCw, LogOut, Trash2, MailOpen, Mail, CalendarPlus, User, Eye, EyeOff } from 'lucide-react'
import { API_URL } from '../lib/config'

interface Appointment {
  id: string
  name: string
  email: string
  whatsapp: string
  service: string
  date: string
  time: string
  message: string
  status: string
  created_at: string
  calendar_event_link?: string
  meet_link?: string
}

interface ContactMsg {
  id: string
  name: string
  email: string
  whatsapp: string
  service: string
  message: string
  read: boolean
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  pendiente: '#F59E0B',
  confirmado: '#22C55E',
  cancelado: '#EF4444',
  completado: '#6B7280',
}

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', 'x-admin-token': token }
}

export function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token') ?? '')
  const [username, setUsername] = useState(() => sessionStorage.getItem('admin_user') ?? '')
  const [authed, setAuthed] = useState(!!sessionStorage.getItem('admin_token'))
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [tab, setTab] = useState<'appointments' | 'messages'>('appointments')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [messages, setMessages] = useState<ContactMsg[]>([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [apptPage, setApptPage] = useState(1)
  const [msgPage, setMsgPage] = useState(1)
  const PAGE_SIZE = 10

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginErr('')
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      })
      if (!res.ok) { setLoginErr('Usuario o contraseña incorrectos'); return }
      const data = await res.json()
      sessionStorage.setItem('admin_token', data.token)
      sessionStorage.setItem('admin_user', data.username)
      setToken(data.token)
      setUsername(data.username)
      setAuthed(true)
    } catch {
      setLoginErr('Error de conexión')
    }
  }

  const doLogout = async () => {
    await fetch(`${API_URL}/api/admin/logout`, {
      method: 'POST',
      headers: authHeaders(token),
    }).catch(() => {})
    sessionStorage.removeItem('admin_token')
    sessionStorage.removeItem('admin_user')
    setToken('')
    setUsername('')
    setAuthed(false)
    setLoginUser('')
    setLoginPass('')
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const [aRes, mRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/appointments`, { headers: authHeaders(token) }),
        fetch(`${API_URL}/api/admin/messages`, { headers: authHeaders(token) }),
      ])
      if (aRes.status === 401) { doLogout(); return }
      if (aRes.ok) setAppointments(await aRes.json())
      if (mRes.ok) setMessages(await mRes.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (authed) loadData() }, [authed])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${API_URL}/api/admin/appointments/${id}`, {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify({ status }),
    })
    loadData()
  }

  const deleteAppointment = async (id: string) => {
    if (!confirm('¿Eliminar esta cita? Esta acción no se puede deshacer.')) return
    setDeleting(id)
    await fetch(`${API_URL}/api/admin/appointments/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    })
    setDeleting(null)
    loadData()
  }

  const deleteMessage = async (id: string) => {
    if (!confirm('¿Eliminar este mensaje? Esta acción no se puede deshacer.')) return
    setDeleting(id)
    await fetch(`${API_URL}/api/admin/messages/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    })
    setDeleting(null)
    loadData()
  }

  const addToCalendar = async (id: string) => {
    const res = await fetch(`${API_URL}/api/admin/appointments/${id}/calendar`, {
      method: 'POST',
      headers: authHeaders(token),
    })
    if (res.ok) {
      const data = await res.json()
      if (data.eventLink) window.open(data.eventLink, '_blank')
      loadData()
    } else {
      alert('Error al crear evento en Google Calendar')
    }
  }

  const toggleRead = async (id: string, currentRead: boolean) => {
    await fetch(`${API_URL}/api/admin/messages/${id}`, {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify({ read: !currentRead }),
    })
    loadData()
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <form onSubmit={doLogin} style={{ background: '#1E293B', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(0,188,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#00BCD4' }}>
              <LogIn size={28} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>Panel Admin</h1>
            <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 6 }}>Techne Creativ — Acceso restringido</p>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Usuario</label>
            <input
              type="text"
              value={loginUser}
              onChange={e => setLoginUser(e.target.value)}
              placeholder="Nombre de usuario"
              required
              autoComplete="username"
              style={{ width: '100%', padding: '12px 16px', background: '#0F172A', border: '1.5px solid #334155', borderRadius: 10, fontSize: 15, color: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font, sans-serif)', textAlign: 'center' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                style={{ width: '100%', padding: '12px 44px 12px 16px', background: '#0F172A', border: '1.5px solid #334155', borderRadius: 10, fontSize: 16, color: '#fff', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box', textAlign: 'center' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: 4, display: 'flex', alignItems: 'center' }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {loginErr && <p style={{ fontSize: 13, color: '#EF4444', margin: 0 }}>{loginErr}</p>}
          <button type="submit" className="btn-teal" style={{ justifyContent: 'center', padding: '12px' }}>
            Ingresar
          </button>
        </form>
      </div>
    )
  }

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid var(--tc-border)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo-dark.png" alt="Techne Creativ" style={{ height: 28 }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--tc-text)' }}>Panel Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {username && (
            <span style={{ fontSize: 13, color: 'var(--tc-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <User size={13} /> {username}
            </span>
          )}
          <button onClick={loadData} style={{ background: 'none', border: '1px solid var(--tc-border)', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--tc-muted)', fontFamily: 'var(--font)' }}>
            <RefreshCw size={14} /> Actualizar
          </button>
          <button onClick={doLogout} style={{ background: 'none', border: '1px solid #FCA5A5', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#EF4444', fontFamily: 'var(--font)' }}>
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Citas totales', value: appointments.length, icon: <Calendar size={18} />, color: '#00BCD4' },
            { label: 'Citas pendientes', value: appointments.filter(a => a.status === 'pendiente').length, icon: <Clock size={18} />, color: '#F59E0B' },
            { label: 'Citas confirmadas', value: appointments.filter(a => a.status === 'confirmado').length, icon: <CheckCircle size={18} />, color: '#22C55E' },
            { label: 'Mensajes sin leer', value: unreadCount, icon: <MessageSquare size={18} />, color: '#8B5CF6' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid var(--tc-border)', borderRadius: 12, padding: '20px', display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--tc-text)', margin: 0, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 12, color: 'var(--tc-muted)', margin: 0, marginTop: 4 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
          {(['appointments', 'messages'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{ padding: '9px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font)', background: tab === t ? 'var(--tc-primary)' : 'transparent', color: tab === t ? '#fff' : 'var(--tc-muted)', transition: 'all 0.2s' }}
            >
              {t === 'appointments' ? `Citas (${appointments.length})` : `Mensajes (${messages.length})${unreadCount > 0 ? ` · ${unreadCount} sin leer` : ''}`}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--tc-muted)' }}>Cargando...</div>
        ) : tab === 'appointments' ? (
          <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'var(--tc-muted)', background: '#fff', borderRadius: 12, border: '1px solid var(--tc-border)' }}>
                No hay citas registradas aún.
              </div>
            ) : appointments.slice((apptPage - 1) * PAGE_SIZE, apptPage * PAGE_SIZE).map(a => (
              <div key={a.id} style={{ background: '#fff', border: '1px solid var(--tc-border)', borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--tc-text)' }}>{a.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 12, background: `${STATUS_COLORS[a.status] ?? '#6B7280'}22`, color: STATUS_COLORS[a.status] ?? '#6B7280' }}>
                        {a.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, color: 'var(--tc-muted)' }}>{a.email}</span>
                      {a.whatsapp && <a href={`https://wa.me/${a.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#25D366', textDecoration: 'none' }}>{a.whatsapp}</a>}
                      <span style={{ fontSize: 13, color: 'var(--tc-muted)' }}>{a.service}</span>
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--tc-text)' }}>📅 {a.date} {a.time}</span>
                    </div>
                    {a.message && <p style={{ fontSize: 13, color: 'var(--tc-muted)', marginTop: 8, maxWidth: 600 }}>{a.message}</p>}
                    {a.calendar_event_link && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                        <a href={a.calendar_event_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#1a73e8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar size={12} /> Ver en Google Calendar
                        </a>
                        {a.meet_link && (
                          <a href={a.meet_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#00897B', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                            📹 Abrir Google Meet
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    {(['confirmado', 'cancelado', 'completado'] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(a.id, s)}
                        disabled={a.status === s}
                        style={{ padding: '6px 12px', border: '1px solid var(--tc-border)', borderRadius: 6, fontSize: 12, cursor: a.status === s ? 'default' : 'pointer', background: a.status === s ? '#F1F5F9' : '#fff', color: a.status === s ? 'var(--tc-muted)' : 'var(--tc-text)', fontFamily: 'var(--font)' }}
                      >
                        {s === 'confirmado' ? <><CheckCircle size={12} style={{ display: 'inline', marginRight: 4 }} />Confirmar</> : s === 'cancelado' ? <><XCircle size={12} style={{ display: 'inline', marginRight: 4 }} />Cancelar</> : 'Completado'}
                      </button>
                    ))}
                    {!a.calendar_event_link && (
                      <button
                        onClick={() => addToCalendar(a.id)}
                        title="Agregar a Google Calendar"
                        style={{ padding: '6px 12px', border: '1px solid #BAE6FD', borderRadius: 6, fontSize: 12, cursor: 'pointer', background: '#F0F9FF', color: '#1a73e8', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <CalendarPlus size={13} /> Agendar
                      </button>
                    )}
                    <button
                      onClick={() => deleteAppointment(a.id)}
                      disabled={deleting === a.id}
                      title="Eliminar cita"
                      style={{ padding: '6px 10px', border: '1px solid #FCA5A5', borderRadius: 6, fontSize: 12, cursor: 'pointer', background: '#FFF5F5', color: '#EF4444', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <Trash2 size={13} /> {deleting === a.id ? '...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {appointments.length > PAGE_SIZE && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
              <button onClick={() => setApptPage(p => Math.max(1, p - 1))} disabled={apptPage === 1} style={{ padding: '6px 16px', border: '1px solid var(--tc-border)', borderRadius: 8, fontSize: 13, cursor: apptPage === 1 ? 'default' : 'pointer', background: '#fff', color: apptPage === 1 ? 'var(--tc-muted)' : 'var(--tc-text)', fontFamily: 'var(--font)' }}>← Anterior</button>
              <span style={{ padding: '6px 12px', fontSize: 13, color: 'var(--tc-muted)' }}>{apptPage} / {Math.ceil(appointments.length / PAGE_SIZE)}</span>
              <button onClick={() => setApptPage(p => Math.min(Math.ceil(appointments.length / PAGE_SIZE), p + 1))} disabled={apptPage === Math.ceil(appointments.length / PAGE_SIZE)} style={{ padding: '6px 16px', border: '1px solid var(--tc-border)', borderRadius: 8, fontSize: 13, cursor: apptPage === Math.ceil(appointments.length / PAGE_SIZE) ? 'default' : 'pointer', background: '#fff', color: apptPage === Math.ceil(appointments.length / PAGE_SIZE) ? 'var(--tc-muted)' : 'var(--tc-text)', fontFamily: 'var(--font)' }}>Siguiente →</button>
            </div>
          )}
          </>
        ) : (
          <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'var(--tc-muted)', background: '#fff', borderRadius: 12, border: '1px solid var(--tc-border)' }}>
                No hay mensajes aún.
              </div>
            ) : messages.slice((msgPage - 1) * PAGE_SIZE, msgPage * PAGE_SIZE).map(m => (
              <div key={m.id} style={{ background: m.read ? '#fff' : '#F0F9FF', border: `1px solid ${m.read ? 'var(--tc-border)' : '#BAE6FD'}`, borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--tc-text)' }}>{m.name}</span>
                      {!m.read && <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#0EA5E9', color: '#fff' }}>Nuevo</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 6, flexWrap: 'wrap' }}>
                      <a href={`mailto:${m.email}`} style={{ fontSize: 13, color: 'var(--tc-primary)', textDecoration: 'none' }}>{m.email}</a>
                      {m.whatsapp && <a href={`https://wa.me/${m.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#25D366', textDecoration: 'none' }}>{m.whatsapp}</a>}
                      {m.service && <span style={{ fontSize: 13, color: 'var(--tc-muted)' }}>{m.service}</span>}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--tc-muted)', marginTop: 10, maxWidth: 700, lineHeight: 1.65 }}>{m.message}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--tc-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(m.created_at).toLocaleDateString('es-CL')}
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => toggleRead(m.id, m.read)}
                        title={m.read ? 'Marcar como no leído' : 'Marcar como leído'}
                        style={{ padding: '5px 10px', border: '1px solid var(--tc-border)', borderRadius: 6, fontSize: 12, cursor: 'pointer', background: '#fff', color: 'var(--tc-muted)', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        {m.read ? <Mail size={13} /> : <MailOpen size={13} />}
                        {m.read ? 'Sin leer' : 'Leído'}
                      </button>
                      <button
                        onClick={() => deleteMessage(m.id)}
                        disabled={deleting === m.id}
                        title="Eliminar mensaje"
                        style={{ padding: '5px 10px', border: '1px solid #FCA5A5', borderRadius: 6, fontSize: 12, cursor: 'pointer', background: '#FFF5F5', color: '#EF4444', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <Trash2 size={13} /> {deleting === m.id ? '...' : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {messages.length > PAGE_SIZE && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
              <button onClick={() => setMsgPage(p => Math.max(1, p - 1))} disabled={msgPage === 1} style={{ padding: '6px 16px', border: '1px solid var(--tc-border)', borderRadius: 8, fontSize: 13, cursor: msgPage === 1 ? 'default' : 'pointer', background: '#fff', color: msgPage === 1 ? 'var(--tc-muted)' : 'var(--tc-text)', fontFamily: 'var(--font)' }}>← Anterior</button>
              <span style={{ padding: '6px 12px', fontSize: 13, color: 'var(--tc-muted)' }}>{msgPage} / {Math.ceil(messages.length / PAGE_SIZE)}</span>
              <button onClick={() => setMsgPage(p => Math.min(Math.ceil(messages.length / PAGE_SIZE), p + 1))} disabled={msgPage === Math.ceil(messages.length / PAGE_SIZE)} style={{ padding: '6px 16px', border: '1px solid var(--tc-border)', borderRadius: 8, fontSize: 13, cursor: msgPage === Math.ceil(messages.length / PAGE_SIZE) ? 'default' : 'pointer', background: '#fff', color: msgPage === Math.ceil(messages.length / PAGE_SIZE) ? 'var(--tc-muted)' : 'var(--tc-text)', fontFamily: 'var(--font)' }}>Siguiente →</button>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  )
}
