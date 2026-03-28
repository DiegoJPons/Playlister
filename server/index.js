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
  return url.trim().replace(/\/$/, '')
}

const defaultOrigins = ['http://localhost:3000'].map(normalizeOrigin)
const extraOrigins = (process.env.CLIENT_ORIGINS || '')
  .split(',')
  .map((s) => normalizeOrigin(s))
  .filter(Boolean)
const allowedOrigins = [...new Set([...defaultOrigins, ...extraOrigins])]

// SETUP THE MIDDLEWARE
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true)
      return
    }
    const requestOrigin = normalizeOrigin(origin)
    if (allowedOrigins.includes(requestOrigin)) {
      callback(null, true)
      return
    }
    if (process.env.CORS_ALLOW_VERCEL === 'true') {
      try {
        const host = new URL(origin).hostname
        if (host === 'vercel.app' || host.endsWith('.vercel.app')) {
          callback(null, true)
          return
        }
      } catch (e) {
        /* ignore */
      }
    }
    console.warn('CORS rejected origin (set CLIENT_ORIGINS on Render):', origin)
    callback(null, false)
  },
  credentials: true,
}))
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
const db = require('./db')
db.on('error', console.error.bind(console, 'Database connection error:'))

// PUT THE SERVER IN LISTENING MODE
app.listen(PORT, () => console.log(`Playlister Server running on port ${PORT}`))


