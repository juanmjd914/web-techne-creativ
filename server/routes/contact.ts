import { Router, type Request, type Response } from 'express'
import { supabase } from '../lib/supabase.js'
import { resend, FROM, ADMIN_EMAIL } from '../lib/resend.js'

export const contactRouter = Router()

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim()
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

contactRouter.post('/', async (req: Request, res: Response) => {
  const raw = req.body
  const name = stripHtml(String(raw.name ?? ''))
  const email = stripHtml(String(raw.email ?? ''))
  const whatsapp = raw.whatsapp ? stripHtml(String(raw.whatsapp)) : ''
  const service = raw.service ? stripHtml(String(raw.service)) : ''
  const message = stripHtml(String(raw.message ?? ''))

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Faltan campos requeridos' })
    return
  }
  if (!isValidEmail(email)) {
    res.status(400).json({ error: 'Formato de email inválido' })
    return
  }

  try {
    const { error: dbErr } = await supabase.from('contact_messages').insert({
      name, email, whatsapp: whatsapp || null, service: service || null, message,
    })
    if (dbErr) throw dbErr

    resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `[Techne Creativ] Nuevo mensaje de ${name}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp || 'No indicado'}</p>
        <p><strong>Servicio:</strong> ${service || 'No especificado'}</p>
        <hr/>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    }).catch(e => console.error('[contact email]', e))

    res.json({ ok: true })
  } catch (e) {
    console.error('[contact]', e)
    res.status(500).json({ error: 'Error interno' })
  }
})
