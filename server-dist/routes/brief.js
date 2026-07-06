import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
export const briefRouter = Router();
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CAMPOS_TEXTO = [
    'negocio_descripcion', 'productos_principales', 'diferenciacion', 'origen_empresa',
    'servicios_otro', 'objetivo_principal', 'criterio_exito', 'plazo_importante',
    'cliente_ideal', 'problema_que_resuelve', 'razon_eleccion', 'dudas_o_miedos',
    'personalidad_marca', 'valores', 'emociones_buscadas', 'marcas_inspiracion',
    'competidores', 'que_hacen_bien', 'que_mejorar',
    'tiene_manual_marca', 'colores_preferencias', 'referencias_visuales',
    'secciones_sitio', 'tiene_contenido', 'accion_deseada',
    'presupuesto', 'herramientas_actuales', 'necesita_integraciones', 'tiene_dominio_hosting', 'quien_aprueba',
];
const SERVICIOS_VALIDOS = ['sitio_web', 'branding', 'automatizacion', 'marketing', 'otro'];
function stripHtml(str) {
    return str.replace(/<[^>]*>/g, '').trim();
}
briefRouter.post('/', async (req, res) => {
    const raw = req.body ?? {};
    const appointmentId = String(raw.appointment_id ?? '');
    if (!UUID_RE.test(appointmentId)) {
        res.status(400).json({ error: 'appointment_id inválido' });
        return;
    }
    const respuestasRaw = raw.respuestas ?? {};
    if (typeof respuestasRaw !== 'object' || respuestasRaw === null || Array.isArray(respuestasRaw)) {
        res.status(400).json({ error: 'respuestas inválidas' });
        return;
    }
    // Whitelist estricto: solo columnas conocidas, saneadas
    const update = { appointment_id: appointmentId };
    for (const campo of CAMPOS_TEXTO) {
        const val = respuestasRaw[campo];
        if (typeof val === 'string')
            update[campo] = stripHtml(val).slice(0, 4000);
    }
    const servicios = respuestasRaw.servicios_solicitados;
    if (Array.isArray(servicios)) {
        update.servicios_solicitados = servicios.filter((v) => typeof v === 'string' && SERVICIOS_VALIDOS.includes(v));
    }
    update.completado = raw.completado === true;
    try {
        // El appointment_id debe corresponder a una cita real (evita poblar la tabla con filas arbitrarias)
        const { data: cita, error: citaErr } = await supabase
            .from('appointments')
            .select('id')
            .eq('id', appointmentId)
            .maybeSingle();
        if (citaErr)
            throw citaErr;
        if (!cita) {
            res.status(404).json({ error: 'Cita no encontrada' });
            return;
        }
        const { error: upsertErr } = await supabase
            .from('brief_respuestas')
            .upsert(update, { onConflict: 'appointment_id' });
        if (upsertErr)
            throw upsertErr;
        res.json({ ok: true });
    }
    catch (e) {
        console.error('[brief]', e);
        res.status(500).json({ error: 'Error interno' });
    }
});
