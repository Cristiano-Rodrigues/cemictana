  import { ServerError } from '../../errors/serverError'
import { Unauthorized } from '../../errors/unauthorized'

const sendError = field => ({
  code: 401,
  error: new Unauthorized(field)
})

const filterUserData = user => ({
  id: user.id,
  name: user.name,
  email: user.email,
  permission: user.permission,
  state: user.state
})

export class LoginController {
  constructor (
    Connection,
    UserRepository,
    Hasher,
    JWTHandler
  ) {
    this.Connection = Connection
    this.UserRepository = UserRepository
    this.hasher = new Hasher()
    this.jwtHandler = new JWTHandler()
  }

  async handle (req) {
    const { email, password } = req.body

    try {
      const conn = new this.Connection()
      const userRepository = new this.UserRepository(conn)

      const user = await userRepository.getByEmail(email)
      if (!user) {
        conn.close()
        return sendError('email')
      }

      const isEqual = this.hasher.compare(password, user.password)

      if (!isEqual) {
        conn.close()
        return sendError('password')
      }

      const payload = {
        id: user.id,
        permission: user.permission,
        email
      }
      const token = this.jwtHandler.generate(payload)
      const filtered = filterUserData(user)

      req.session.user = filtered

      conn.close()

      return {
        code: 200,
        success: true,
        result: {
          user: filtered,
          token
        }
      }

    } catch (error) {
      return {
        code: 500,
        error: new ServerError()
      }
    }
  }
}