import { InvalidEntry, ServerError } from '../../errors/'

export class DeleteUserController {
  constructor (
    Connection,
    UserRepository
  ) {
    this.Connection = Connection
    this.UserRepository = UserRepository
  }

  async handle (req) {
    const id = req.params?.id

    if ( !id ) {
      return {
        code: 400,
        error: new InvalidEntry('id')
      }
    }

    try {
      const conn = new this.Connection()
      const userRepository = new this.UserRepository(conn)
      
      await userRepository.delete(id)

      conn.close()
    } catch (error) {
      return {
        code: 500,
        error: new ServerError()
      }
    }

    return {
      code: 204,
      success: true
    }
  }
}