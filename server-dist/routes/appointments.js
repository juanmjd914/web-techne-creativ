import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { resend, FROM, ADMIN_EMAIL } from '../lib/resend.js';
export const appointmentsRouter = Router();
function stripHtml(str) {
    return str.replace(/<[^>]*>/g, '').trim();
}
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPhone(phone) {
    return phone.replace(/\D/g, '').length >= 7;
}
// Perfiles del CRM para asignación automática según prefijo del WhatsApp
const PROFILE_SIMON = '2f489d11-ac85-45ea-a354-f4d1fcb7ea7a'; // smejiasdaza — Chile (56)
const PROFILE_JUAN_CARLOS = '7469449c-3041-4d41-b5d1-29ece7d8aba8'; // jmejiasdaza — Venezuela (58)
/**
 * Crea (o actualiza) el prospecto en el CRM cuando alguien agenda una cita.
 * - Deduplica por número de WhatsApp (comparando solo dígitos).
 * - Existente: avanza stage a "Reunión" (salvo Ganado), anota la cita y reactiva si estaba Perdido.
 * - Nuevo: entra en "Reunión", asignado según prefijo (56→Simón, 58→Juan Carlos, sin prefijo→sin asignar).
 * - También registra la cita en el módulo Citas del CRM, vinculada al prospecto.
 * Nunca lanza: si algo falla, la cita ya quedó guardada y solo se loguea el error.
 */
async function sincronizarProspectoCRM(appt) {
    try {
        const digits = appt.whatsapp.replace(/\D/g, '');
        const nota = `📅 Agendó cita por la web — ${appt.service} · ${appt.date} ${appt.time}`;
        let assignedTo = null;
        if (digits.startsWith('56'))
            assignedTo = PROFILE_SIMON;
        else if (digits.startsWith('58'))
            assignedTo = PROFILE_JUAN_CARLOS;
        // Buscar prospecto existente por WhatsApp (solo dígitos, para tolerar formatos distintos)
        const { data: candidatos, error: qErr } = await supabase
            .from('prospectos')
            .select('id, whatsapp, stage, notas, assigned_to')
            .not('whatsapp', 'is', null);
        if (qErr)
            throw qErr;
        const existente = (candidatos ?? []).find(p => String(p.whatsapp).replace(/\D/g, '') === digits);
        let prospectoId;
        if (existente) {
            const updates = {
                notas: existente.notas ? `${existente.notas}\n${nota}` : nota,
            };
            if (existente.stage !== 'Ganado') {
                updates.stage = 'Reunión';
                updates.perdido_at = null;
            }
            if (!existente.assigned_to && assignedTo)
                updates.assigned_to = assignedTo;
            const { error: upErr } = await supabase.from('prospectos').update(updates).eq('id', existente.id);
            if (upErr)
                throw upErr;
            prospectoId = existente.id;
        }
        else {
            const { data: nuevo, error: insErr } = await supabase.from('prospectos').insert({
                nombre_negocio: appt.name,
                contacto: appt.name,
                whatsapp: appt.whatsapp,
                email: appt.email,
                stage: 'Reunión',
                notas: nota,
                assigned_to: assignedTo,
            }).select('id').single();
            if (insErr)
                throw insErr;
            prospectoId = nuevo.id;
        }
        // Vincular la cita web al prospecto y reflejarla en el módulo Citas del CRM
        await supabase.from('appointments').update({ prospecto_id: prospectoId }).eq('id', appt.id);
        await supabase.from('citas').insert({
            prospecto_id: prospectoId,
            titulo: `Cita web — ${appt.service}`,
            fecha: appt.date,
            hora: appt.time,
            estado: 'Pendiente',
            assigned_to: assignedTo,
            notas: 'Agendada desde technecreativ.com/agendar-cita',
        });
    }
    catch (e) {
        console.error('[appointments → CRM]', e);
    }
}
appointmentsRouter.post('/', async (req, res) => {
    const raw = req.body;
    const name = stripHtml(String(raw.name ?? ''));
    const email = stripHtml(String(raw.email ?? ''));
    const whatsapp = stripHtml(String(raw.whatsapp ?? ''));
    const service = stripHtml(String(raw.service ?? ''));
    const date = stripHtml(String(raw.date ?? ''));
    const time = stripHtml(String(raw.time ?? ''));
    const message = raw.message ? stripHtml(String(raw.message)) : '';
    if (!name || !email || !whatsapp || !service || !date || !time) {
        res.status(400).json({ error: 'Faltan campos requeridos' });
        return;
    }
    if (!isValidEmail(email)) {
        res.status(400).json({ error: 'Formato de email inválido' });
        return;
    }
    if (!isValidPhone(whatsapp)) {
        res.status(400).json({ error: 'Número de WhatsApp inválido' });
        return;
    }
    try {
        const { data: inserted, error: dbErr } = await supabase.from('appointments').insert({
            name, email, whatsapp, service, date, time,
            message: message || null, status: 'pendiente',
        }).select('id').single();
        if (dbErr)
            throw dbErr;
        // Sincronizar con el CRM en segundo plano (no bloquea la respuesta al cliente)
        sincronizarProspectoCRM({ id: inserted.id, name, email, whatsapp, service, date, time })
            .catch(e => console.error('[appointments → CRM]', e));
        const emailAdmin = resend.emails.send({
            from: FROM,
            to: ADMIN_EMAIL,
            subject: `[Techne Creativ] Nueva cita: ${name} — ${date} ${time}`,
            html: `
        <h2>Nueva cita agendada 📅</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>WhatsApp:</strong> <a href="https://wa.me/${whatsapp.replace(/\D/g, '')}">${whatsapp}</a></p>
        <p><strong>Servicio:</strong> ${service}</p>
        <p><strong>Fecha y hora:</strong> ${date} a las ${time}</p>
        ${message ? `<hr/><p><strong>Mensaje:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>` : ''}
        <hr/>
        <p><a href="https://technecreativ.com/admin">Gestionar en panel admin →</a></p>
      `,
        });
        const emailCliente = resend.emails.send({
            from: FROM,
            to: email,
            subject: `Tu cita con Techne Creativ está siendo procesada`,
            html: `
        <h2>¡Gracias, ${name}! 🎉</h2>
        <p>Hemos recibido tu solicitud de cita y te confirmaremos en menos de 24 horas por este correo y por WhatsApp.</p>
        <p><strong>Resumen:</strong></p>
        <ul>
          <li>Servicio: ${service}</li>
          <li>Fecha preferida: ${date} a las ${time}</li>
        </ul>
        <p>Si tienes alguna consulta urgente, escríbenos directamente: <a href="https://wa.me/56965174454">+56 9 6517 4454</a></p>
        <br/>
        <p>— Equipo Techne Creativ</p>
        <p><a href="https://technecreativ.com">technecreativ.com</a></p>
      `,
        });
        Promise.all([emailAdmin, emailCliente]).catch(e => console.error('[appointments email]', e));
        res.json({ ok: true, id: inserted.id });
    }
    catch (e) {
        console.error('[appointments]', e);
        res.status(500).json({ error: 'Error interno' });
    }
});
