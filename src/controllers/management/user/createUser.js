import { DuplicatedData, InvalidEntry, ServerError } from '../../errors/'
import { generateRandomCode, sendActivationCode } from '../../helpers/'

const filterUser = user => ({
  name: user.name,
  email: user.email,
  permission: user.permission
})

export class CreateUserController {
  constructor (
    Connection,
    UserRepository,
    Hasher,
    Mailer
  ) {
    this.Connection = Connection
    this.UserRepository = UserRepository
    this.hasher = new Hasher()
    this.mailer = new Mailer()
  }

  async handle (req) {
    const {
      name,
      email,
      password,
      permission
    } = req.body

    const anyNullValue = [name, email, password, permission].some(field => field == null)

    if ( anyNullValue ) {
      return {
        code: 400,
        error: new InvalidEntry('name, email, password or permission')
      }
    }

    try {
      const conn = new this.Connection()
      const userRepository = new this.UserRepository(conn)

      const alreadyExists = await userRepository.getByEmail(email)

      if ( alreadyExists ) {
        return {
          code: 400,
          error: new DuplicatedData('email')
        }
      }

      const saltKey = 10
      const hash = this.hasher.hash(password, saltKey)
      const code = generateRandomCode({ min: 100_000, max: 1_000_000 })

      await sendActivationCode(email, code, this.mailer)

      const user = {
        name,
        email,
        password: hash,
        permission,
        state: 0,
        code
      }
      await userRepository.create(user)

      conn.close()

      return {
        code: 201,
        success: true,
        user: filterUser(user)
      }
    } catch (error) {
      return {
        code: 500,
        error: new ServerError()
      }
    }
  }
}