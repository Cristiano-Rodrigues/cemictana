import { ServerError } from '../../errors'
import { getToken } from '../../../utils/jwt'

export class GetDefunctsByUserController {
  constructor (
    Connection,
    DefunctRepository,
    _,
    JWTHandler
  ) {
    this.Connection = Connection
    this.DefunctRepository = DefunctRepository
    this.jwtHandler = new JWTHandler()
  }

  async handle (req) {
    const token = getToken(req)

    try {
      const conn = new this.Connection()
      const defunctRepository = new this.DefunctRepository(conn)
      
      const payload = this.jwtHandler.verify(token)
      const user = payload.id
      const result = await defunctRepository.getByUser(user)

      conn.close()

      return {
        code: 200,
        success: true,
        result
      }
    } catch (error) {
      return {
        code: 500,
        error: new ServerError()
      }
    }
  }
}