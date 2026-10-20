import { readFileSync } from 'fs';
// Etiquetas de titulo/descripcion/Open Graph escritas por el servidor en el
// HTML de cada pagina. Solo hacen falta cuando el prerender falla en el
// build: sin ellas el HTML llega sin <title> ni og:*, y WhatsApp/Facebook
// (que no ejecutan JS) no arman la tarjeta del enlace. Son las mismas que
// pone src/components/SEOHead.tsx y salen del mismo seo-pages.json.
const SITE = 'Techne Creativ';
const DOMAIN = 'https://technecreativ.com';
const OG_IMAGE = `${DOMAIN}/og-image.jpg`;
export function loadSeoPages(file) {
    try {
        return JSON.parse(readFileSync(file, 'utf8'));
    }
    catch (e) {
        console.error('[seo] No se pudo leer', file, e);
        return {};
    }
}
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function seoTags(pages, route) {
    const page = pages[route];
    if (!page)
        return '';
    const title = esc(`${page.title} — ${SITE}`);
    const description = esc(page.description);
    const url = `${DOMAIN}${route}`;
    return [
        `<title>${title}</title>`,
        `<meta name="description" content="${description}">`,
        `<meta name="robots" content="index, follow">`,
        `<link rel="canonical" href="${url}">`,
        `<meta property="og:type" content="website">`,
        `<meta property="og:title" content="${title}">`,
        `<meta property="og:description" content="${description}">`,
        `<meta property="og:url" content="${url}">`,
        `<meta property="og:image" content="${OG_IMAGE}">`,
        `<meta property="og:image:width" content="1200">`,
        `<meta property="og:image:height" content="630">`,
        `<meta property="og:site_name" content="${SITE}">`,
        `<meta property="og:locale" content="es_419">`,
        `<meta name="twitter:card" content="summary_large_image">`,
        `<meta name="twitter:site" content="@technecreativ">`,
        `<meta name="twitter:title" content="${title}">`,
        `<meta name="twitter:description" content="${description}">`,
        `<meta name="twitter:image" content="${OG_IMAGE}">`,
    ].join('');
}
// Si el HTML ya trae og:title (prerender OK) se deja tal cual.
export function injectSeo(html, pages, route) {
    if (html.includes('property="og:title"'))
        return html;
    const tags = seoTags(pages, route);
    return tags ? html.replace('</head>', `${tags}</head>`) : html;
}
