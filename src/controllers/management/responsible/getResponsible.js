import { ServerError } from '../../errors/'

export class GetResponsiblesController {
  constructor (
    Connection,
    ResponsibleRepository
  ) {
    this.conn = new Connection()
    this.responsibleRepository = new ResponsibleRepository(this.conn)
  }

  async handle (_) {
    try {
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