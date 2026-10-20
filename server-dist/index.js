import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { contactRouter } from './routes/contact.js';
import { appointmentsRouter } from './routes/appointments.js';
import { adminRouter } from './routes/admin.js';
import { briefRouter } from './routes/brief.js';
import { demoRouter } from './routes/demo.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const app = express();
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? true
        : (origin, cb) => cb(null, !origin || origin.startsWith('http://localhost')),
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' },
});
app.use('/api/appointments', apiLimiter);
app.use('/api/contact', apiLimiter);
app.use('/api/demo', apiLimiter);
// El brief guarda una respuesta por cada pregunta (~25 llamadas en una sola sesión) — necesita un límite más alto que appointments/contact.
const briefLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' },
});
app.use('/api/brief', briefLimiter);
// API routes
app.use('/api/contact', contactRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/brief', briefRouter);
app.use('/api/demo', demoRouter);
// Health check
app.get('/api/salud', (_req, res) => res.json({ ok: true, env: process.env.NODE_ENV }));
// OAuth helper (solo desarrollo — generar refresh token)
if (process.env.NODE_ENV !== 'production') {
    const { google } = await import('googleapis');
    const oauthClient = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'http://localhost:3001/oauth/callback');
    app.get('/oauth/start', (_req, res) => {
        const url = oauthClient.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/calendar'],
            prompt: 'consent',
        });
        res.redirect(url);
    });
    app.get('/oauth/callback', async (req, res) => {
        const code = req.query.code;
        const { tokens } = await oauthClient.getToken(code);
        res.send(`<pre>REFRESH TOKEN:\n\n${tokens.refresh_token}\n\nCópialo y ponlo en .env como GOOGLE_REFRESH_TOKEN</pre>`);
    });
    app.get('/oauth/test', async (_req, res) => {
        const token = process.env.GOOGLE_REFRESH_TOKEN ?? '';
        const secret = process.env.GOOGLE_CLIENT_SECRET ?? '';
        const clientId = process.env.GOOGLE_CLIENT_ID ?? '';
        const body = new URLSearchParams({ client_id: clientId, client_secret: secret, refresh_token: token, grant_type: 'refresh_token' });
        const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
        const data = await r.json();
        res.json({ status: r.status, data, token_prefix: token.slice(0, 25), client_prefix: clientId.slice(0, 20) });
    });
}
// Serve frontend in production
const dist = path.join(__dirname, '..', 'dist');
// Paginas prerenderizadas (scripts/prerender.mjs) — archivos PLANOS, no
// carpeta+index.html, a proposito: asi la URL que pide el navegador/bot y
// la URL declarada en canonical/sitemap/og:url son exactamente la misma,
// sin ningun redirect 301 de por medio.
const PRERENDERED_ROUTES = ['servicios', 'por-que-nosotros', 'proceso', 'contacto', 'agendar-cita'];
// Si el prerender fallo en el build (no rompe el deploy a proposito, ver
// scripts/prerender.mjs), el .html de la ruta no existe: se sirve el HTML
// base y React renderiza la pagina en el navegador. Sin este respaldo la
// ruta respondia "Not Found" (paso en produccion el 2026-10-20).
for (const route of PRERENDERED_ROUTES) {
    const file = path.join(dist, `${route}.html`);
    app.get(`/${route}`, (_req, res) => res.sendFile(existsSync(file) ? file : path.join(dist, 'index.html')));
}
// Assets con hash en el nombre (/assets/index-CMYwAiSn.js) -- cualquier cambio
// de contenido genera un nombre de archivo nuevo, asi que se pueden cachear
// "para siempre" sin riesgo de servir una version vieja. PageSpeed marcaba
// esto como el ahorro mas grande (1.6MB) porque antes TODO se servia con
// max-age=0 (cero cache) via express.static por defecto.
app.use('/assets', express.static(path.join(dist, 'assets'), {
    maxAge: '1y',
    immutable: true,
}));
// Resto de archivos estaticos (imagenes/video/logos en public/) -- no tienen
// hash en el nombre, asi que un cache largo con revalidacion es mas seguro
// que "immutable". Los .html se excluyen del cache largo: express.static
// serviria index.html/servicios.html/etc con el mismo maxAge, y despues de
// cada deploy el navegador seguiria mostrando la version vieja hasta que
// expire el cache.
app.use(express.static(dist, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html'))
            res.setHeader('Cache-Control', 'no-cache');
    },
}));
// Rutas que existen solo del lado del cliente, sin HTML prerenderizado propio.
const SPA_ROUTES = new Set(['/', '/admin']);
const has404Page = existsSync(path.join(dist, '404.html'));
// Antes este comodin devolvia index.html con 200 para CUALQUIER URL: Google
// las veia como paginas reales ("soft 404" en Search Console) y PageSpeed
// recibia HTML al pedir /.well-known/ai-catalog.json. Ahora solo las rutas
// reales responden 200; el resto da 404 de verdad.
app.get('/{*path}', (req, res) => {
    const p = req.path.toLowerCase().replace(/\/+$/, '') || '/';
    if (SPA_ROUTES.has(p)) {
        res.sendFile(path.join(dist, 'index.html'));
        return;
    }
    res.status(404);
    if (p.startsWith('/api/')) {
        res.json({ error: 'No encontrado' });
        return;
    }
    // Archivos que no existen (.json, .png, .php...): 404 plano, sin HTML.
    if (path.extname(p)) {
        res.type('text/plain').send('Not found');
        return;
    }
    // Paginas que no existen: 404.html prerenderizado (NotFound). Si el
    // prerender fallo en el build, el HTML base sirve igual: React muestra
    // NotFound al cargar.
    res.sendFile(path.join(dist, has404Page ? '404.html' : 'index.html'));
});
app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Techne Creativ] Servidor en puerto ${PORT}`);
});
