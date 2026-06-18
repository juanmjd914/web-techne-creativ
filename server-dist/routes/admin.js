import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { resend, FROM } from '../lib/resend.js';
import { createCalendarEvent } from '../lib/googleCalendar.js';
import { randomUUID } from 'crypto';
export const adminRouter = Router();
// Parse users: "user1:pass1|user2:pass2|user3:pass3"
const USERS = {};
const rawUsers = process.env.ADMIN_USERS ?? '';
rawUsers.split('|').forEach(entry => {
    const idx = entry.indexOf(':');
    if (idx > 0) {
        const u = entry.slice(0, idx).trim();
        const p = entry.slice(idx + 1).trim();
        if (u && p)
            USERS[u] = p;
    }
});
// In-memory sessions: token → username
const sessions = new Map();
function checkSession(token) {
    return !!token && sessions.has(token);
}
function tokenFrom(req) {
    return req.headers['x-admin-token'] ?? req.query.token;
}
adminRouter.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password || USERS[username] !== password) {
        res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        return;
    }
    const token = randomUUID();
    sessions.set(token, username);
    res.json({ ok: true, token, username });
});
adminRouter.post('/logout', (req, res) => {
    const token = tokenFrom(req);
    if (token)
        sessions.delete(token);
    res.json({ ok: true });
});
adminRouter.get('/appointments', async (req, res) => {
    if (!checkSession(tokenFrom(req))) {
        res.status(401).json({ error: 'No autorizado' });
        return;
    }
    const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        res.status(500).json({ error: 'Error DB' });
        return;
    }
    res.json(data);
});
adminRouter.patch('/appointments/:id', async (req, res) => {
    if (!checkSession(tokenFrom(req))) {
        res.status(401).json({ error: 'No autorizado' });
        return;
    }
    const { status } = req.body;
    const { data: appt, error: fetchErr } = await supabase
        .from('appointments').select('*').eq('id', req.params.id).single();
    if (fetchErr || !appt) {
        res.status(404).json({ error: 'Cita no encontrada' });
        return;
    }
    const { error } = await supabase.from('appointments').update({ status }).eq('id', req.params.id);
    if (error) {
        res.status(500).json({ error: 'Error DB' });
        return;
    }
    if (status === 'confirmado') {
        createCalendarEvent(appt).then(({ eventLink, meetLink }) => {
            const meetInfo = meetLink
                ? `<p><strong>Link de Google Meet:</strong> <a href="${meetLink}">${meetLink}</a></p>`
                : '';
            resend.emails.send({
                from: FROM,
                to: appt.email,
                subject: `✅ Tu cita con Techne Creativ está confirmada`,
                html: `
          <h2>¡Tu cita está confirmada, ${appt.name}! 🎉</h2>
          <p>Hemos revisado tu solicitud y todo está listo.</p>
          <p><strong>Resumen de tu cita:</strong></p>
          <ul>
            <li>Servicio: ${appt.service}</li>
            <li>Fecha: ${appt.date} a las ${appt.time}</li>
          </ul>
          ${meetInfo}
          <p>Si necesitas reagendar, escríbenos:</p>
          <ul>
            <li>WhatsApp: <a href="https://wa.me/56965174454">+56 9 6517 4454</a></li>
            <li>Email: <a href="mailto:ventas@technecreativ.com">ventas@technecreativ.com</a></li>
          </ul>
          <p>— Equipo Techne Creativ · <a href="https://technecreativ.com">technecreativ.com</a></p>
        `,
            }).catch(e => console.error('[confirm email]', e));
            if (eventLink) {
                supabase.from('appointments')
                    .update({ calendar_event_link: eventLink, meet_link: meetLink ?? null })
                    .eq('id', req.params.id).then();
            }
        }).catch(e => console.error('[calendar]', e));
    }
    res.json({ ok: true });
});
adminRouter.post('/appointments/:id/calendar', async (req, res) => {
    if (!checkSession(tokenFrom(req))) {
        res.status(401).json({ error: 'No autorizado' });
        return;
    }
    const { data: appt, error: fetchErr } = await supabase
        .from('appointments').select('*').eq('id', req.params.id).single();
    if (fetchErr || !appt) {
        res.status(404).json({ error: 'Cita no encontrada' });
        return;
    }
    try {
        const { eventLink, meetLink } = await createCalendarEvent(appt);
        await supabase.from('appointments')
            .update({ calendar_event_link: eventLink ?? null, meet_link: meetLink ?? null })
            .eq('id', req.params.id);
        res.json({ ok: true, eventLink, meetLink });
    }
    catch (e) {
        console.error('[calendar manual]', e);
        res.status(500).json({ error: 'Error al crear evento en Google Calendar' });
    }
});
adminRouter.delete('/appointments/:id', async (req, res) => {
    if (!checkSession(tokenFrom(req))) {
        res.status(401).json({ error: 'No autorizado' });
        return;
    }
    const { error } = await supabase.from('appointments').delete().eq('id', req.params.id);
    if (error) {
        res.status(500).json({ error: 'Error DB' });
        return;
    }
    res.json({ ok: true });
});
adminRouter.delete('/messages/:id', async (req, res) => {
    if (!checkSession(tokenFrom(req))) {
        res.status(401).json({ error: 'No autorizado' });
        return;
    }
    const { error } = await supabase.from('contact_messages').delete().eq('id', req.params.id);
    if (error) {
        res.status(500).json({ error: 'Error DB' });
        return;
    }
    res.json({ ok: true });
});
adminRouter.patch('/messages/:id', async (req, res) => {
    if (!checkSession(tokenFrom(req))) {
        res.status(401).json({ error: 'No autorizado' });
        return;
    }
    const { read: isRead } = req.body;
    const { error } = await supabase.from('contact_messages').update({ read: isRead }).eq('id', req.params.id);
    if (error) {
        res.status(500).json({ error: 'Error DB' });
        return;
    }
    res.json({ ok: true });
});
adminRouter.get('/messages', async (req, res) => {
    if (!checkSession(tokenFrom(req))) {
        res.status(401).json({ error: 'No autorizado' });
        return;
    }
    const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        res.status(500).json({ error: 'Error DB' });
        return;
    }
    res.json(data);
});
