import { InvalidEntry, ServerError } from '../../errors/'

export class UpdateUserController {
  constructor (
    Connection,
    UserRepository,
    Hasher,
  ) {
    this.Connection = Connection
    this.UserRepository = UserRepository
    this.hasher = new Hasher()
  }

  async handle (req) {
    const {
      id,
      name,
      password,
      permission,
      newPassword
    } = req.body

    const anyNullValue = [id, name, password, permission].some(field => field == null)

    if ( anyNullValue ) {
      return {
        code: 400,
        error: new InvalidEntry('id, name, password or permission')
      }
    }

    try {
      const conn = new this.Connection()
      const userRepository = new this.UserRepository(this.conn)

      const user = await userRepository.getById(id)

      if ( !user ) {
        return {
          code: 400,
          error: new InvalidEntry('id')
        }
      }

      if ( !(this.hasher.compare(password, user.password)) ) {
        return {
          code: 400,
          error: new InvalidEntry('password')
        }
      }

      let hash = null
      if ( newPassword ) {
        const saltKey = 10
        hash = this.hasher.hash(newPassword, saltKey)
      }

      const newUser = Object.assign({}, user, {
        name,
        password: hash || user.password,
        permission,
        state: 0,
        code: 0
      })
      await userRepository.update(id, newUser)

      conn.close()

      return {
        code: 201,
        success: true,
      }
    } catch (error) {
      return {
        code: 500,
        error: new ServerError()
      }
    }
  }
}