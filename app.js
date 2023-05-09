import session from 'express-session'
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { Unauthorized } from './src/middlewares/errors/unauthorized'

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 1000 * 60 * 60,
    secure: false
  }
}))

app.use((req, res, next) => {
  const serveStatic = express.static(path.join(process.cwd(), '/public'))
  const urlParts = req.url.split('/')
  if (urlParts[1] != 'pages') {
    return next()
  }
  const user = req.session?.user
  if (
    (urlParts[2] == 'admin' && user?.permission != 'admin') ||
    (urlParts[2] == 'standard' && user?.permission != 'standard')
  ) {
    return res.status(401).send({
      error: new Unauthorized()
    })
  }

  req.url = urlParts.slice(2).join('/')
  try {
    serveStatic(req, res, next)
  } catch (e) {
    res.status(404).send('Not found')
  }
})

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  next()
})

async function load (filename) {
  const src = './src/routes/' + filename
  const exported = (await import(src)).default
  const router = express.Router()
  
  return exported(router)
}

function registerRoute(route) {
  app.use('/api/v1', route)
}

Promise.all([
  'main',
  'account',
  'employee',
  'responsible',
  'defunct',
  'scheduling',
  'unit',
  'user'
]
.map(load))
.then(result => result.forEach(registerRoute))

export default app