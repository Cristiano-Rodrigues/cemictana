import expressMySqlSession from 'express-mysql-session'
import session from 'express-session'
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { Unauthorized } from './src/middlewares/errors/unauthorized'

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const MySQLStore = expressMySqlSession(session)
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 1000 * 60 * 60,
    secure: false
  }
}))

app.use(express.static(path.join(process.cwd(), '/pages')))

app.set('views', path.join(process.cwd(), '/pages'))
app.set('view engine', 'ejs')

app.use((req, res, next) => {
  const urlParts = req.url.split('/')
  if (urlParts[1] != 'pages') {
    return next()
  }
  const user = req.session?.user
  if (
    (urlParts[2] == 'admin' && !['admin', 'funcionário'].includes(user?.permission)) ||
    (urlParts[2] == 'standard' && user?.permission != 'padrão')
  ) {
    return res.status(401).send({
      error: new Unauthorized()
    })
  }

  req.url = urlParts.slice(2).join('/')
  res.render(req.url, { user }, (err, file) => {
    if (err) {
      return res.status(404).send()
    }
    res.send(file)
  })
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