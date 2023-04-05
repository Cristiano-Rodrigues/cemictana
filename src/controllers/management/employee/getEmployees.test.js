import { ServerError } from '../../errors/serverError.js'
import { GetEmployeesController } from './getEmployees.js'

const ConnectionStub = class {
  close () {}
}
const EmployeeRepositoryStub = class {
  async get () {
    return []
  }
}

const getEmployeesController = new GetEmployeesController(
  ConnectionStub,
  EmployeeRepositoryStub
)

describe('GetEmployeesController', () => {
  test('Should return an error object if any internal server error', async () => {
    const employeeRepositoryStub = class {
      get () {
        throw new Error('any_error')
      }
    }
    const getEmployeesController = new GetEmployeesController(
      ConnectionStub,
      employeeRepositoryStub
    )

    const result = await getEmployeesController.handle()
    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return a success object if no error', async () => {
    const result = await getEmployeesController.handle()
    expect(result).toEqual({
      code: 200,
      success: true,
      result: []
    })
  })
})