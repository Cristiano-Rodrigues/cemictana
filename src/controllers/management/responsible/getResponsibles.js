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
      this.conn = new this.Connection()
      this.responsibleRepository = new this.ResponsibleRepository(this.conn)
      
      const result = await this.responsibleRepository.get()

      this.conn.close()

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