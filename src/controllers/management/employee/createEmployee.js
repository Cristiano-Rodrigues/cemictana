import { DuplicatedData } from '../../errors/duplicatedData'
import { InvalidEntry } from '../../errors/invalidEntry'

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

    const anyNullValue = [name, identification, post].some(field =>
      field == null)

    if ( anyNullValue ) {
      return {
        code: 400,
        error: new InvalidEntry('name, identification or post')
      }
    }

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

    return {
      code: 201,
      success: true
    }
  }
}