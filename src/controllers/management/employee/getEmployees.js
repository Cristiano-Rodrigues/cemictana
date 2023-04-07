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
      const conn = new this.Connection()
      const employeeRepository = new this.EmployeeRepository(conn)
      
      const result = await employeeRepository.get()

      conn.close()

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