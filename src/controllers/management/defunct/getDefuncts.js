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
      const conn = new this.Connection()
      const defunctRepository = new this.DefunctRepository(conn)
      
      const result = await defunctRepository.get()

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