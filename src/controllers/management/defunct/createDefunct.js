import { DuplicatedData, InvalidEntry, ServerError } from '../../errors/'

export class CreateDefunctController {
  constructor (
    Connection,
    DefunctRepository,
    UserRepository
  ) {
    this.Connection = Connection
    this.DefunctRepository = DefunctRepository
    this.UserRepository = UserRepository
  }

  async handle (req) {
    const {
      name,
      identification,
      responsible,
      bornDate,
      deathDate,
      deathCause
    } = req.body

    const anyNullValue = [name, identification, responsible, bornDate, deathDate].some(field => field == null)

    if ( anyNullValue ) {
      return {
        code: 400,
        error: new InvalidEntry('name, identification, responsible, bornDate or deathDate')
      }
    }

    const anyLaterDate = [bornDate, deathDate].some(field => {
      const date = new Date(field)
      return Date.now() < date.getTime()
    })

    if ( anyLaterDate ) {
      return {
        code: 400,
        error: new InvalidEntry('bornDate or deathDate')
      }
    }

    try {
      const conn = new this.Connection()
      const defunctRepository = new this.DefunctRepository(conn)
      const userRepository = new this.UserRepository(conn)

      const alreadyExists = await defunctRepository.getByIdentification(identification)

      if ( alreadyExists ) {
        return {
          code: 400,
          error: new DuplicatedData('identification')
        }
      }

      const notExists = await userRepository.getById(responsible)

      if ( !notExists ) {
        return {
          code: 400,
          error: new InvalidEntry('responsible')
        }
      }

      const defunct = await defunctRepository.create({
        name,
        identification,
        responsible,
        bornDate,
        deathDate,
        deathCause
      })

      conn.close()

      return {
        code: 201,
        success: true,
        defunct: {
          id: defunct.insertId
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