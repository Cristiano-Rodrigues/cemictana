import { ServerError } from '../../errors/'

export class GetSchedulingsController {
  constructor (
    Connection,
    SchedulingRepository
  ) {
    this.Connection = Connection
    this.SchedulingRepository = SchedulingRepository
  }

  async handle (_) {
    try {
      const conn = new this.Connection()
      const schedulingRepository = new this.SchedulingRepository(conn)
      
      const result = await schedulingRepository.get()

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