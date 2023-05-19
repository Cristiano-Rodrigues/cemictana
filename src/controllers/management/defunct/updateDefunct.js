import { DuplicatedData, InvalidEntry, ServerError } from '../../errors/'

export class UpdateDefunctController {
  constructor (
    Connection,
    DefunctRepository,
    ResponsibleRepository
  ) {
    this.Connection = Connection
    this.DefunctRepository = DefunctRepository
    this.ResponsibleRepository = ResponsibleRepository
  }

  async handle (req) {
    const {
      id,
      name,
      identification,
      responsible,
      bornDate,
      deathDate,
      deathCause
    } = req.body

    const anyNullValue = [id, name, identification, responsible, bornDate, deathDate].some(field => field == null)

    if ( anyNullValue ) {
      return {
        code: 400,
        error: new InvalidEntry('id, name, identification, responsible, bornDate or deathDate')
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
      const responsibleRepository = new this.ResponsibleRepository(conn)
      
      const defunct = await defunctRepository.getByIdentification(identification)
      const alreadyExists = !!defunct && defunct.id != id

      if ( alreadyExists ) {
        return {
          code: 400,
          error: new DuplicatedData('identification')
        }
      }

      const notExists = await responsibleRepository.getById(responsible)

      if ( !notExists ) {
        return {
          code: 400,
          error: new InvalidEntry('responsible')
        }
      }

      const newDefunct = Object.assign({}, defunct, {
        name,
        identification,
        responsible,
        bornDate,
        deathDate,
        deathCause
      })

      await defunctRepository.update(id, newDefunct)

      conn.close()
    } catch (error) {
      return {
        code: 500,
        error: new ServerError()
      }
    }

    return {
      code: 200,
      success: true
    }
  }
}