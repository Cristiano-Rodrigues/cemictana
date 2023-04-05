import app from './app.js'
import http from 'http'

const server = http.createServer(app)
const { PORT: port, HOST: host } = process.env

server.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`)
})