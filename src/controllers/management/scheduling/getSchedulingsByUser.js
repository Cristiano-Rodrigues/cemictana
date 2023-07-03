import { ServerError } from '../../errors'
import { getToken } from '../../../utils/jwt'

export class GetSchedulingsByUserController {
  constructor (
    Connection,
    SchedulingRepository,
    JWTHandler
  ) {
    this.Connection = Connection
    this.SchedulingRepository = SchedulingRepository
    this.jwtHandler = new JWTHandler()
  }

  async handle (req) {
    const token = getToken(req)

    try {
      const conn = new this.Connection()
      const schedulingRepository = new this.SchedulingRepository(conn)
      
      const payload = this.jwtHandler.verify(token)
      const user = payload.id
      const result = await schedulingRepository.getByUser(user)

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