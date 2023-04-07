import { ServerError } from '../../errors/'

export class GetUsersController {
  constructor (
    Connection,
    UserRepository
  ) {
    this.Connection = Connection
    this.UserRepository = UserRepository
  }

  async handle (_) {
    try {
      const conn = new this.Connection()
      const userRepository = new this.UserRepository(conn)
      
      const result = await userRepository.get()

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