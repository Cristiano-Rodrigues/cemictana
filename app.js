import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
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
  'employee',
  'main'
]
.map(load))
.then(result => result.forEach(registerRoute))

export default app