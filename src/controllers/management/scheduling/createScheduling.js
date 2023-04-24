import { InvalidEntry, ServerError } from '../../errors/'

export class CreateSchedulingController {
  constructor (
    Connection,
    SchedulingRepository,
    ResponsibleRepository,
    DefunctRepository,
    UnitRepository
  ) {
    this.Connection = Connection
    this.SchedulingRepository = SchedulingRepository
    this.ResponsibleRepository = ResponsibleRepository
    this.DefunctRepository = DefunctRepository
    this.UnitRepository = UnitRepository
  }

  async handle (req) {
    const {
      type,
      schedulingDate,
      responsible,
      defunct,
      unit
    } = req.body

    const anyNullValue = [type, schedulingDate, responsible, defunct, unit].some(field => field == null)

    if ( anyNullValue ) {
      return {
        code: 400,
        error: new InvalidEntry('type, schedulingDate, responsible, defunct or unit')
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
      const responsibleRepository = new this.ResponsibleRepository(conn)
      const defunctRepository = new this.DefunctRepository(conn)
      const unitRepository = new this.UnitRepository(conn)

      const exist = !!(
        await responsibleRepository.getById(responsible) &&
        await defunctRepository.getById(defunct) &&
        await unitRepository.getById(unit)
      )

      if ( !exist ) {
        return {
          code: 400,
          error: new InvalidEntry('responsible, defunct or unit')
        }
      }

      await schedulingRepository.create({
        type,
        schedulingDate,
        responsible,
        defunct,
        employee: null,
        unit
      })

      conn.close()
    } catch (error) {
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