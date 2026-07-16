import { Router, type Request, type Response } from 'express'
import { supabase } from '../lib/supabase.js'
import { resend, FROM, ADMIN_EMAIL } from '../lib/resend.js'

export const demoRouter = Router()

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim()
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPhone(phone: string): boolean {
  return phone.replace(/\D/g, '').length >= 7
}

// Perfiles del CRM para asignación automática según prefijo del WhatsApp
const PROFILE_SIMON = '2f489d11-ac85-45ea-a354-f4d1fcb7ea7a'       // smejiasdaza — Chile (56)
const PROFILE_JUAN_CARLOS = '7469449c-3041-4d41-b5d1-29ece7d8aba8' // jmejiasdaza — Venezuela (58)

// Stages del pipeline en orden — usado para no retroceder a un prospecto que ya avanzó más
const STAGE_ORDER = ['Nuevo', 'Contactado', 'Reunión', 'Propuesta enviada', 'Ganado']

/**
 * Crea (o actualiza) el prospecto en el CRM cuando alguien solicita una demo gratis.
 * - Deduplica por número de WhatsApp (comparando solo dígitos).
 * - Existente: agrega la nota; solo avanza stage a "Contactado" si el stage actual
 *   está antes en el pipeline (nunca retrocede a alguien que ya está en Reunión/Propuesta/Ganado).
 *   Si estaba Perdido, lo reactiva en Contactado.
 * - Nuevo: entra en "Contactado", asignado según prefijo (56→Simón, 58→Juan Carlos, sin prefijo→sin asignar).
 * - A diferencia de una cita, NO crea registro en el módulo Citas del CRM (no hay fecha/hora concreta).
 * Nunca lanza: si algo falla, la solicitud ya quedó guardada y solo se loguea el error.
 */
async function sincronizarProspectoCRM(demo: { id: string; negocio: string; nombre: string; whatsapp: string; email: string; tipo_proyecto: string }): Promise<void> {
  try {
    const digits = demo.whatsapp.replace(/\D/g, '')
    const nota = `📋 Solicitó Demo Gratis por la web — ${demo.tipo_proyecto}`

    let assignedTo: string | null = null
    if (digits.startsWith('56')) assignedTo = PROFILE_SIMON
    else if (digits.startsWith('58')) assignedTo = PROFILE_JUAN_CARLOS

    const { data: candidatos, error: qErr } = await supabase
      .from('prospectos')
      .select('id, whatsapp, stage, notas, assigned_to')
      .not('whatsapp', 'is', null)
    if (qErr) throw qErr

    const existente = (candidatos ?? []).find(p => String(p.whatsapp).replace(/\D/g, '') === digits)

    let prospectoId: string
    if (existente) {
      const updates: Record<string, unknown> = {
        notas: existente.notas ? `${existente.notas}\n${nota}` : nota,
      }
      const stageActualIdx = STAGE_ORDER.indexOf(existente.stage)
      const esPerdido = existente.stage === 'Perdido'
      if (esPerdido) {
        updates.stage = 'Contactado'
        updates.perdido_at = null
      } else if (stageActualIdx !== -1 && stageActualIdx < STAGE_ORDER.indexOf('Contactado')) {
        updates.stage = 'Contactado'
      }
      if (!existente.assigned_to && assignedTo) updates.assigned_to = assignedTo
      const { error: upErr } = await supabase.from('prospectos').update(updates).eq('id', existente.id)
      if (upErr) throw upErr
      prospectoId = existente.id
    } else {
      const { data: nuevo, error: insErr } = await supabase.from('prospectos').insert({
        nombre_negocio: demo.negocio,
        contacto: demo.nombre,
        whatsapp: demo.whatsapp,
        email: demo.email || null,
        stage: 'Contactado',
        notas: nota,
        assigned_to: assignedTo,
      }).select('id').single()
      if (insErr) throw insErr
      prospectoId = nuevo.id
    }

    await supabase.from('demo_requests').update({ prospecto_id: prospectoId }).eq('id', demo.id)
  } catch (e) {
    console.error('[demo → CRM]', e)
  }
}

demoRouter.post('/', async (req: Request, res: Response) => {
  const raw = req.body
  const negocio = stripHtml(String(raw.negocio ?? ''))
  const nombre = stripHtml(String(raw.nombre ?? ''))
  const whatsapp = stripHtml(String(raw.whatsapp ?? ''))
  const tipo_proyecto = stripHtml(String(raw.tipo_proyecto ?? ''))
  const email = raw.email ? stripHtml(String(raw.email)) : ''
  const mensaje = raw.mensaje ? stripHtml(String(raw.mensaje)) : ''

  if (!negocio || !nombre || !whatsapp || !tipo_proyecto) {
    res.status(400).json({ error: 'Faltan campos requeridos' })
    return
  }
  if (!isValidPhone(whatsapp)) {
    res.status(400).json({ error: 'Número de WhatsApp inválido' })
    return
  }
  if (email && !isValidEmail(email)) {
    res.status(400).json({ error: 'Formato de email inválido' })
    return
  }

  try {
    const { data: inserted, error: dbErr } = await supabase.from('demo_requests').insert({
      negocio, nombre, whatsapp, email: email || null, tipo_proyecto,
      mensaje: mensaje || null, status: 'pendiente',
    }).select('id').single()
    if (dbErr) throw dbErr

    // Sincronizar con el CRM en segundo plano (no bloquea la respuesta al cliente)
    sincronizarProspectoCRM({ id: inserted.id, negocio, nombre, whatsapp, email, tipo_proyecto })
      .catch(e => console.error('[demo → CRM]', e))

    const emailAdmin = resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `[Techne Creativ] Solicitud de Demo Gratis: ${negocio}`,
      html: `
        <h2>Nueva solicitud de Demo Gratis 🎬</h2>
        <p><strong>Negocio:</strong> ${negocio}</p>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>WhatsApp:</strong> <a href="https://wa.me/${whatsapp.replace(/\D/g, '')}">${whatsapp}</a></p>
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
        <p><strong>Tipo de proyecto:</strong> ${tipo_proyecto}</p>
        ${mensaje ? `<hr/><p><strong>Mensaje:</strong></p><p>${mensaje.replace(/\n/g, '<br>')}</p>` : ''}
        <hr/>
        <p><a href="https://technecreativ.com/admin">Gestionar en panel admin →</a></p>
      `,
    })

    const emailsToSend = [emailAdmin]
    if (email) {
      emailsToSend.push(
        resend.emails.send({
          from: FROM,
          to: email,
          subject: `Recibimos tu solicitud de Demo Gratis — Techne Creativ`,
          html: `
            <h2>¡Gracias, ${nombre}! 🎉</h2>
            <p>Recibimos tu solicitud para ver una demo gratis de tu ${tipo_proyecto.toLowerCase()}. Te contactaremos en menos de 24 horas por WhatsApp o correo.</p>
            <p>Si tienes alguna consulta urgente, escríbenos directamente: <a href="https://wa.me/56965174454">+56 9 6517 4454</a></p>
            <br/>
            <p>— Equipo Techne Creativ</p>
            <p><a href="https://technecreativ.com">technecreativ.com</a></p>
          `,
        })
      )
    }
    Promise.all(emailsToSend).catch(e => console.error('[demo email]', e))

    res.json({ ok: true, id: inserted.id })
  } catch (e) {
    console.error('[demo]', e)
    res.status(500).json({ error: 'Error interno' })
  }
})
