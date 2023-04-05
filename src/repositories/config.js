import mysql from 'mysql'
import { promisify } from 'util'

const getEnvVars = () => ([
  'DB_HOST',
  'DB_USER',
  'DB_PASS',
  'DB_PORT',
  'DB_NAME',
]).map(envVar => process.env[ envVar ])

export class Connection {
  constructor () {
    const [ host, user, password, port, dbname ] = getEnvVars()
    const conn = mysql.createConnection({
      host, user, password, port,
      database: dbname,
      multipleStatements: true
    })

    this.conn = conn
    this.query = promisify(conn.query).bind(conn)
  }

  close () {
    this.conn.destroy()
  }
}