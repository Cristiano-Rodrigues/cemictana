import { ServerError } from '../../errors/'

export class GetUnitsController {
  constructor (
    Connection,
    UnitRepository
  ) {
    this.Connection = Connection
    this.UnitRepository = UnitRepository
  }

  async handle (_) {
    try {
      const conn = new this.Connection()
      const unitRepository = new this.UnitRepository(conn)
      
      const result = await unitRepository.get()

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