import { DuplicatedData } from '../../errors/duplicatedData'
import { InvalidEntry } from '../../errors/invalidEntry'
import { ServerError } from '../../errors/serverError'

export class UpdateEmployeeController {
  constructor (
    Connection,
    EmployeeRepository
  ) {
    this.conn = new Connection()
    this.employeeRepository = new EmployeeRepository(this.conn)
  }

  async handle (req) {
    const {
      id,
      name,
      identification,
      post,
      bornDate,
      address
    } = req.body

    const anyNullValue = [id, name, identification, post].some(field => field == null)

    if ( anyNullValue ) {
      return {
        code: 400,
        error: new InvalidEntry('name, identification or post')
      }
    }

    try {
      const employee = await this.employeeRepository.getByIdentification(identification)
      const alreadyExists = !!employee && employee.id != id

      if ( alreadyExists ) {
        return {
          code: 400,
          error: new DuplicatedData('identification')
        }
      }

      const newEmployee = Object.assign({}, employee, {
        name,
        identification,
        post,
        bornDate,
        address
      })

      await this.employeeRepository.update(id, newEmployee)

      this.conn.close()
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