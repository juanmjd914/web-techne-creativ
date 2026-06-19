import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
function loadServiceAccount() {
    // Primary: environment variables (recommended for production)
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (clientEmail && privateKey) {
        console.log('[gcal] Loaded service account from env vars');
        return { client_email: clientEmail, private_key: privateKey };
    }
    // Fallback: JSON file in multiple possible locations
    const candidates = [
        join(process.cwd(), 'server', 'google-service-account.json'),
        join(process.cwd(), 'google-service-account.json'),
        join(__dirname, '..', 'google-service-account.json'),
        join(__dirname, '..', '..', 'server', 'google-service-account.json'),
    ];
    for (const p of candidates) {
        if (existsSync(p)) {
            console.log('[gcal] Loaded service account from file:', p);
            return JSON.parse(readFileSync(p, 'utf-8'));
        }
    }
    console.error('[gcal] Service account not found. cwd:', process.cwd(), '| Tried files:', candidates);
    throw new Error('Google service account credentials not found. Set GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY env vars.');
}
export const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID ?? 'primary';
// JWT signing for service account
async function signJwt(payload, privateKeyPem) {
    const header = { alg: 'RS256', typ: 'JWT' };
    const encode = (obj) => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const toSign = `${encode(header)}.${encode(payload)}`;
    const pemBody = privateKeyPem
        .replace(/-----BEGIN PRIVATE KEY-----/, '')
        .replace(/-----END PRIVATE KEY-----/, '')
        .replace(/\n/g, '');
    const keyData = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));
    const cryptoKey = await crypto.subtle.importKey('pkcs8', keyData.buffer, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(toSign));
    const sigBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    return `${toSign}.${sigBase64}`;
}
async function getAccessToken() {
    const sa = loadServiceAccount();
    const now = Math.floor(Date.now() / 1000);
    const jwt = await signJwt({
        iss: sa.client_email,
        scope: 'https://www.googleapis.com/auth/calendar',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600,
    }, sa.private_key);
    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt,
        }).toString(),
    });
    const data = await res.json();
    if (!res.ok || !data.access_token) {
        console.error('[gcal] Service account token error:', JSON.stringify(data));
        throw new Error(`Service account auth error: ${data.error} — ${data.error_description}`);
    }
    return data.access_token;
}
export async function createCalendarEvent(appt) {
    const accessToken = await getAccessToken();
    const [year, month, day] = appt.date.split('-').map(Number);
    const [hour, minute] = appt.time.split(':').map(Number);
    const start = new Date(year, month - 1, day, hour, minute);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const event = {
        summary: `Cita: ${appt.service} — ${appt.name}`,
        description: `Cliente: ${appt.name}\nEmail: ${appt.email}\nWhatsApp: ${appt.whatsapp}${appt.message ? `\nMensaje: ${appt.message}` : ''}`,
        start: { dateTime: start.toISOString(), timeZone: 'America/Santiago' },
        end: { dateTime: end.toISOString(), timeZone: 'America/Santiago' },
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'email', minutes: 24 * 60 },
                { method: 'popup', minutes: 30 },
            ],
        },
    };
    const calRes = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
    });
    const calData = await calRes.json();
    if (!calRes.ok) {
        console.error('[gcal] Event error:', JSON.stringify(calData));
        throw new Error(`Calendar API error: ${calData.error?.message}`);
    }
    return {
        eventId: calData.id,
        eventLink: calData.htmlLink,
        meetLink: undefined,
    };
}
