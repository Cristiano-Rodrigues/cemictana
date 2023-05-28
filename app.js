import expressMySqlSession from 'express-mysql-session'
import session from 'express-session'
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'

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
    maxAge: 24 * 60 * 60 * 1000,
    secure: false
  }
}))

app.use(express.static(path.join(process.cwd(), '/public')))

app.set('views', path.join(process.cwd(), '/views'))
app.set('view engine', 'ejs')

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  next()
})

function getAPIRouteFiles () {
  return [
    'api/main',
    'api/account',
    'api/employee',
    'api/responsible',
    'api/defunct',
    'api/scheduling',
    'api/unit',
    'api/user'
  ]
}

function getPageRouteFiles () {
  return [
    'pages/admin',
    'pages/public',
    'pages/user'
  ]
}

async function load (filename) {
  const src = './src/routes/' + filename
  const exported = (await import(src)).default
  const router = express.Router()
  
  return exported(router)
}

function registerAPIRoute (route) {
  app.use('/api/v1', route)
}

function registerPageRoute (route) {
  app.use('/app', route)
}

Promise.all(
  getAPIRouteFiles().map(load)
)
.then(result => result.forEach(registerAPIRoute))

Promise.all(
  getPageRouteFiles().map(load)
)
.then(result => result.forEach(registerPageRoute))

export default app