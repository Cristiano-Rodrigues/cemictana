import { InvalidEntry, ServerError } from '../../errors/'

export class DeleteEmployeeController {
  constructor (
    Connection,
    EmployeeRepository
  ) {
    this.Connection = Connection
    this.EmployeeRepository = EmployeeRepository
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
      this.conn = new this.Connection()
      this.employeeRepository = new this.EmployeeRepository(this.conn)
      
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