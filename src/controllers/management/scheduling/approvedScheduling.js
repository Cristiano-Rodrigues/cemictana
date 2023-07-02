import { InvalidEntry, ServerError } from '../../errors'

export class ApprovedSchedulingController {
  constructor (
    Connection,
    SchedulingRepository
  ) {
    this.Connection = Connection
    this.SchedulingRepository = SchedulingRepository
  }

  async handle (req) {
    const { id } = req.body

    if (!id) {
      return {
        code: 400,
        error: new InvalidEntry('id')
      }
    }

    try {
      const conn = new this.Connection()
      const schedulingRepository = new this.SchedulingRepository(conn)

      const schedule = await schedulingRepository.getById(id)

      if (!schedule) {
        return {
          code: 400,
          error: new InvalidEntry('id')
        }
      }

      const newSchedule = Object.assign({}, schedule, {
        status: 1
      })

      await schedulingRepository.update(id, newSchedule)

      conn.close()
    } catch (error) {
      return {
        code: 500,
        error: new ServerError()
      }
    }

    return {
      code: 200,
      success: true
    }
  }
}