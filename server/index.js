// THESE ARE NODE APIs WE WISH TO USE
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

// CREATE OUR SERVER
dotenv.config()
const PORT = process.env.PORT || 4000;
const app = express()

app.set('trust proxy', 1)

function normalizeOrigin(url) {
  if (!url) return ''
  let s = url.trim().replace(/\/$/, '')
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim()
  }
  return s.replace(/\/$/, '')
}

const defaultOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].map(normalizeOrigin)
const extraOrigins = (process.env.CLIENT_ORIGINS || '')
  .split(',')
  .map((s) => normalizeOrigin(s))
  .filter(Boolean)
const allowedOrigins = [...new Set([...defaultOrigins, ...extraOrigins])]

function isVercelPreviewOrigin(origin) {
  try {
    const host = new URL(origin).hostname.toLowerCase()
    return host === 'vercel.app' || host.endsWith('.vercel.app')
  } catch (e) {
    return false
  }
}

function isRenderStaticOrigin(origin) {
  try {
    const host = new URL(origin).hostname.toLowerCase()
    return host.endsWith('.onrender.com')
  } catch (e) {
    return false
  }
}

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true)
      return
    }
    const requestOrigin = normalizeOrigin(origin)
    if (allowedOrigins.includes(requestOrigin)) {
      callback(null, true)
      return
    }
    if (isVercelPreviewOrigin(origin)) {
      callback(null, true)
      return
    }
    if (process.env.CORS_ALLOW_RENDER_STATIC === 'true' && isRenderStaticOrigin(origin)) {
      callback(null, true)
      return
    }
    console.warn('CORS rejected origin:', origin, '| configured:', allowedOrigins.join(' | ') || '(none)')
    callback(null, false)
  },
  credentials: true,
}

console.log(
  'CORS: explicit CLIENT_ORIGINS →',
  allowedOrigins.filter((o) => !defaultOrigins.includes(o)).join(', ') || '(none; Vercel *.vercel.app still allowed)',
)

// SETUP THE MIDDLEWARE
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// Browsers opening the API host directly hit GET / — there is no React app here
app.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'Playlister API',
    hint: 'Open your deployed React app URL in the browser. This address is only for API requests.',
  })
})
app.get('/favicon.ico', (req, res) => res.status(204).end())

// SETUP OUR OWN ROUTERS AS MIDDLEWARE
const authRouter = require('./routes/auth-router')
app.use('/auth', authRouter)
const storeRouter = require('./routes/store-router')
app.use('/store', storeRouter)

// INITIALIZE OUR DATABASE OBJECT
const mongoose = require('mongoose')
const db = require('./db')
db.on('error', console.error.bind(console, 'Database connection error:'))

function scheduleFixtureSeed() {
  const reset = process.env.SEED_DB_RESET_ON_START === 'true'
  const onStart = process.env.SEED_DB_ON_START === 'true'
  if (!reset && !onStart) return

  const run = () => {
    const { maybeSeedFromFixture } = require('./db/seedFromFixture')
    maybeSeedFromFixture().catch((err) =>
      console.error('Fixture seed failed:', err),
    )
  }
  if (mongoose.connection.readyState === 1) run()
  else mongoose.connection.once('open', run)
}

scheduleFixtureSeed()

// PUT THE SERVER IN LISTENING MODE
app.listen(PORT, () => console.log(`Playlister Server running on port ${PORT}`))


