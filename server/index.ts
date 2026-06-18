import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'
import { contactRouter } from './routes/contact.js'
import { appointmentsRouter } from './routes/appointments.js'
import { adminRouter } from './routes/admin.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT) || 3001
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

const app = express()

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? true
    : (origin, cb) => cb(null, !origin || origin.startsWith('http://localhost')),
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' },
})
app.use('/api/appointments', apiLimiter)
app.use('/api/contact', apiLimiter)

// API routes
app.use('/api/contact', contactRouter)
app.use('/api/appointments', appointmentsRouter)
app.use('/api/admin', adminRouter)

// Health check
app.get('/api/salud', (_req, res) => res.json({ ok: true, env: process.env.NODE_ENV }))

// OAuth helper (solo desarrollo — generar refresh token)
if (process.env.NODE_ENV !== 'production') {
  const { google } = await import('googleapis')
  const oauthClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3001/oauth/callback'
  )
  app.get('/oauth/start', (_req, res) => {
    const url = oauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
      prompt: 'consent',
    })
    res.redirect(url)
  })
  app.get('/oauth/callback', async (req, res) => {
    const code = req.query.code as string
    const { tokens } = await oauthClient.getToken(code)
    res.send(`<pre>REFRESH TOKEN:\n\n${tokens.refresh_token}\n\nCópialo y ponlo en .env como GOOGLE_REFRESH_TOKEN</pre>`)
  })
  app.get('/oauth/test', async (_req, res) => {
    const token = process.env.GOOGLE_REFRESH_TOKEN ?? ''
    const secret = process.env.GOOGLE_CLIENT_SECRET ?? ''
    const clientId = process.env.GOOGLE_CLIENT_ID ?? ''
    const body = new URLSearchParams({ client_id: clientId, client_secret: secret, refresh_token: token, grant_type: 'refresh_token' })
    const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
    const data = await r.json()
    res.json({ status: r.status, data, token_prefix: token.slice(0, 25), client_prefix: clientId.slice(0, 20) })
  })
}

// Serve frontend in production
const dist = path.join(__dirname, '..', 'dist')
app.use(express.static(dist))
app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(dist, 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Techne Creativ] Servidor en puerto ${PORT}`)
})
