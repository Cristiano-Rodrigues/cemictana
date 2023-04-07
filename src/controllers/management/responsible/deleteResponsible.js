import { InvalidEntry, ServerError } from '../../errors/'

export class DeleteResponsibleController {
  constructor (
    Connection,
    ResponsibleRepository
  ) {
    this.Connection = Connection
    this.ResponsibleRepository = ResponsibleRepository
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
      const responsibleRepository = new this.ResponsibleRepository(conn)
      
      await responsibleRepository.delete(id)

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