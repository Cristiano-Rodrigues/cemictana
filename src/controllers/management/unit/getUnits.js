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
      this.conn = new this.Connection()
      this.unitRepository = new this.UnitRepository(this.conn)
      
      const result = await this.unitRepository.get()

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