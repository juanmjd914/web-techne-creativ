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
        const { error: dbErr } = await supabase.from('appointments').insert({
            name, email, whatsapp, service, date, time,
            message: message || null, status: 'pendiente',
        });
        if (dbErr)
            throw dbErr;
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
        res.json({ ok: true });
    }
    catch (e) {
        console.error('[appointments]', e);
        res.status(500).json({ error: 'Error interno' });
    }
});
