import { Resend } from 'resend';
const key = process.env.RESEND_API_KEY;
if (!key)
    throw new Error('Falta variable de entorno: RESEND_API_KEY');
export const resend = new Resend(key);
export const FROM = 'Techne Creativ <notificaciones@technecreativ.com>';
export const ADMIN_EMAIL = 'ventas@technecreativ.com';
