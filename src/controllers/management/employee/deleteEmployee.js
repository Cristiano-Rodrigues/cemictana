import { InvalidEntry, ServerError } from '../../errors/'

export class DeleteEmployeeController {
  constructor (
    Connection,
    EmployeeRepository
  ) {
    this.conn = new Connection()
    this.employeeRepository = new EmployeeRepository(this.conn)
  }

  async handle (req) {
    const id = req.params?.id

    if ( !id ) {
      return {
        code: 400,
        error: new InvalidEntry('id')
      }
    }

    try {
      await this.employeeRepository.delete(id)

      this.conn.close()
    } catch (error) {
      return {
        code: 500,
        error: new ServerError()
      }
    }

    return {
      code: 204,
      success: true
    }
  }
}