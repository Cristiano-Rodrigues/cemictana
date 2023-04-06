import { ServerError } from '../../errors/'

export class GetEmployeesController {
  constructor (
    Connection,
    EmployeeRepository
  ) {
    this.Connection = Connection
    this.EmployeeRepository = EmployeeRepository
  }

  async handle (_) {
    try {
      this.conn = new this.Connection()
      this.employeeRepository = new this.EmployeeRepository(this.conn)
      
      const result = await this.employeeRepository.get()

      this.conn.close()

      return {
        code: 200,
        success: true,
        result
      }
    } catch (error) {
      return {
        code: 500,
        error: new ServerError()
      }
    }
  }
}