import { ServerError } from '../../errors/'

export class GetEmployeesController {
  constructor (
    Connection,
    EmployeeRepository
  ) {
    this.conn = new Connection()
    this.employeeRepository = new EmployeeRepository(this.conn)
  }

  async handle (_) {
    try {
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