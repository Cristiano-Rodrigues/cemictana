import { ServerError } from '../../errors/'

export class GetUnitsController {
  constructor (
    Connection,
    UnitRepository
  ) {
    this.conn = new Connection()
    this.unitRepository = new UnitRepository(this.conn)
  }

  async handle (_) {
    try {
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