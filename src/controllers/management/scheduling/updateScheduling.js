import { InvalidEntry, ServerError } from '../../errors/'

export class UpdateSchedulingController {
  constructor (
    Connection,
    SchedulingRepository,
    ResponsibleRepository,
    DefunctRepository,
    UnitRepository,
    EmployeeRepository
  ) {
    this.Connection = Connection
    this.SchedulingRepository = SchedulingRepository
    this.ResponsibleRepository = ResponsibleRepository
    this.DefunctRepository = DefunctRepository
    this.UnitRepository = UnitRepository
    this.EmployeeRepository = EmployeeRepository
  }

  async handle (req) {
    const {
      id,
      type,
      schedulingDate,
      responsible,
      defunct,
      employee,
      unit
    } = req.body

    const anyNullValue = [id, type, schedulingDate, responsible, defunct, employee, unit]
      .some(field => field == null)

    if ( anyNullValue ) {
      return {
        code: 400,
        error: new InvalidEntry('type, schedulingDate, responsible, defunct, employee or unit')
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
      const employeeRepository = new this.EmployeeRepository(conn)
      const unitRepository = new this.UnitRepository(conn)

      const exist = !!(
        await responsibleRepository.getById(responsible) &&
        await defunctRepository.getById(defunct) &&
        await employeeRepository.getById(employee) &&
        await unitRepository.getById(unit)
      )

      if ( !exist ) {
        return {
          code: 400,
          error: new InvalidEntry('responsible, defunct, employee or unit')
        }
      }

      await schedulingRepository.update(id, {
        type,
        schedulingDate,
        responsible,
        defunct,
        employee,
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
      code: 200,
      success: true
    }
  }
}