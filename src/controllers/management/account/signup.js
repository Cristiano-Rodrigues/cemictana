import { DuplicatedData, InvalidEntry, ServerError } from '../../errors'
import { generateRandomCode, sendActivationCode } from '../../helpers'

export class SignUpController {
  constructor (
    Connection,
    UserRepository,
    ResponsibleRepository,
    Hasher,
    Mailer
  ) {
    this.Connection = Connection
    this.UserRepository = UserRepository
    this.ResponsibleRepository = ResponsibleRepository
    this.hasher = new Hasher()
    this.mailer = new Mailer()
  }

  async handle (req) {
    const {
      name,
      identification,
      email,
      password
    } = req.body

    const anyNullValue = [name, identification, email, password].some(field => field == null)

    if ( anyNullValue ) {
      return {
        code: 400,
        error: new InvalidEntry('name, identification, email, password')
      }
    }

    try {
      const conn = new this.Connection()
      const userRepository = new this.UserRepository(conn)
      const responsibleRepository = new this.ResponsibleRepository(conn)

      let alreadyExists = await userRepository.getByEmail(email)

      if ( alreadyExists ) {
        return {
          code: 400,
          error: new DuplicatedData('email')
        }
      }

      alreadyExists = await responsibleRepository.getByIdentification(identification)

      if ( alreadyExists ) {
        return {
          code: 400,
          error: new DuplicatedData('identification')
        }
      }

      const saltKey = 10
      const hash = this.hasher.hash(password, saltKey)
      const code = generateRandomCode({ min: 100_000, max: 1_000_000 })

      await sendActivationCode(email, code, this.mailer)

      await userRepository.create({
        name,
        email,
        password: hash,
        permission: 'standard',
        state: 0,
        code
      })

      await responsibleRepository.create({
        name,
        identification
      })

      conn.close()
    } catch (error) {
      return {
        code: 500,
        error: new ServerError()
      }
    }

    return {
      code: 201,
      success: true
    }
  }
}