import { InvalidEntry, ServerError } from '../../errors/'

export class UpdateSchedulingController {
  constructor (
    Connection,
    SchedulingRepository,
    DefunctRepository,
    UnitRepository,
    EmployeeRepository
  ) {
    this.Connection = Connection
    this.SchedulingRepository = SchedulingRepository
    this.DefunctRepository = DefunctRepository
    this.UnitRepository = UnitRepository
    this.EmployeeRepository = EmployeeRepository
  }

  async handle (req) {
    const {
      id,
      type,
      schedulingDate,
      defunct,
      employee,
      unit
    } = req.body

    const anyNullValue = [id, type, schedulingDate, defunct, employee, unit]
      .some(field => field == null)

    if ( anyNullValue ) {
      return {
        code: 400,
        error: new InvalidEntry('type, schedulingDate, defunct, employee or unit')
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
      const employeeRepository = new this.EmployeeRepository(conn)
      const unitRepository = new this.UnitRepository(conn)

      const exist = !!(
        await defunctRepository.getById(defunct) &&
        await employeeRepository.getById(employee) &&
        await unitRepository.getById(unit)
      )

      if ( !exist ) {
        return {
          code: 400,
          error: new InvalidEntry('defunct, employee or unit')
        }
      }

      const scheduling = schedulingRepository.getById(id)

      if (!scheduling) {
        return {
          code: 400,
          error: new InvalidEntry('id')
        }
      }

      const newScheduling = Object.assign({}, scheduling, {
        type,
        schedulingDate,
        defunct,
        employee,
        unit
      })

      await schedulingRepository.update(id, newScheduling)

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