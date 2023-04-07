import { DuplicatedData, InvalidEntry, ServerError } from '../../errors/'

export class CreateEmployeeController {
  constructor (
    Connection,
    EmployeeRepository
  ) {
    this.Connection = Connection
    this.EmployeeRepository = EmployeeRepository
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

    if ( bornDate ) {
      const date = new Date(bornDate)
      if (Date.now() < date.getTime()) {
        return {
          code: 400,
          error: new InvalidEntry('bornDate')
        }
      }
    }

    try {
      const conn = new this.Connection()
      const employeeRepository = new this.EmployeeRepository(conn)

      const alreadyExists = await employeeRepository.getByIdentification(identification)

      if ( alreadyExists ) {
        return {
          code: 400,
          error: new DuplicatedData('identification')
        }
      }

      await employeeRepository.create({
        name,
        identification,
        post,
        bornDate,
        address
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