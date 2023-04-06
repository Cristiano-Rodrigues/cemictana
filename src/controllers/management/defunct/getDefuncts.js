import { ServerError } from '../../errors'

export class GetDefunctsController {
  constructor (
    Connection,
    DefunctRepository
  ) {
    this.Connection = Connection
    this.DefunctRepository = DefunctRepository
  }

  async handle (_) {
    try {
      this.conn = new this.Connection()
      this.defunctRepository = new this.DefunctRepository(this.conn)
      
      const result = await this.defunctRepository.get()

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