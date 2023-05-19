import { InvalidEntry, ServerError } from '../../errors/'

export class CreateSchedulingController {
  constructor (
    Connection,
    SchedulingRepository,
    DefunctRepository,
    UnitRepository
  ) {
    this.Connection = Connection
    this.SchedulingRepository = SchedulingRepository
    this.DefunctRepository = DefunctRepository
    this.UnitRepository = UnitRepository
  }

  async handle (req) {
    const {
      type,
      schedulingDate,
      defunct,
      unit
    } = req.body

    const anyNullValue = [type, schedulingDate, defunct, unit].some(field => field == null)

    if ( anyNullValue ) {
      return {
        code: 400,
        error: new InvalidEntry('type, schedulingDate, defunct or unit')
      }
    }

    const date = new Date(schedulingDate)
    if (Date.now() > date.getTime()) {
      return {
        code: 400,
        error: new InvalidEntry('schedulingDate')
      }
    }

    try {
      const conn = new this.Connection()
      const schedulingRepository = new this.SchedulingRepository(conn)
      const defunctRepository = new this.DefunctRepository(conn)
      const unitRepository = new this.UnitRepository(conn)

      const exist = !!(
        await defunctRepository.getById(defunct) &&
        await unitRepository.getById(unit)
      )

      if ( !exist ) {
        return {
          code: 400,
          error: new InvalidEntry('defunct or unit')
        }
      }

      await schedulingRepository.create({
        type,
        schedulingDate,
        defunct,
        employee: null,
        unit
      })

      conn.close()
    } catch (error) {
      console.log(error)
      return {
        code: 500,
        error: new ServerError()
      }
    }

    return {
      code: 201,
      success: true
    }
  }
}