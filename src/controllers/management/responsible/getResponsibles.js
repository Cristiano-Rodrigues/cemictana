import { ServerError } from '../../errors'

export class GetResponsiblesController {
  constructor (
    Connection,
    ResponsibleRepository
  ) {
    this.Connection = Connection
    this.ResponsibleRepository = ResponsibleRepository
  }

  async handle (_) {
    try {
      const conn = new this.Connection()
      const responsibleRepository = new this.ResponsibleRepository(conn)
      
      const result = await responsibleRepository.get()

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