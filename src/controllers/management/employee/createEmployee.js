import { DuplicatedData } from '../../errors/duplicatedData'
import { InvalidEntry } from '../../errors/invalidEntry'
import { ServerError } from '../../errors/serverError'

export class CreateEmployeeController {
  constructor (
    Connection,
    EmployeeRepository
  ) {
    this.conn = new Connection()
    this.employeeRepository = new EmployeeRepository(this.conn)
  }

  async handle (req) {
    const {
      name,
      identification,
      post,
      bornDate,
      address
    } = req.body

    const anyNullValue = [name, identification, post].some(field => field == null)

    if ( anyNullValue ) {
      return {
        code: 400,
        error: new InvalidEntry('name, identification or post')
      }
    }

    try {
      const alreadyExists = await this.employeeRepository.getByIdentification(identification)

      if ( alreadyExists ) {
        return {
          code: 400,
          error: new DuplicatedData(identification)
        }
      }

      await this.employeeRepository.create({
        name,
        identification,
        post,
        bornDate,
        address
      })

      this.conn.close()
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