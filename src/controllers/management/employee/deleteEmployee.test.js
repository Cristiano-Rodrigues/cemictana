import { InvalidEntry } from '../../errors/invalidEntry.js'
import { ServerError } from '../../errors/serverError.js'
import { DeleteEmployeeController } from './deleteEmployee.js'

const ConnectionStub = class {
  close () {}
}
const EmployeeRepositoryStub = class {
  async delete () {}
}

const deleteEmployeeController = new DeleteEmployeeController(
  ConnectionStub,
  EmployeeRepositoryStub
)

describe('DeleteEmployeeController', () => {
  test('Should return an error object if no id is provided', async () => {
    const result = await deleteEmployeeController.handle({})
    expect(result).toEqual({
      code: 400,
      error: new InvalidEntry('id')
    })
  })

  test('Should return an error object if any internal server error', async () => {
    const employeeRepositoryStub = class {
      get () {
        throw new Error('any_error')
      }
    }
    const deleteEmployeeController = new DeleteEmployeeController(
      ConnectionStub,
      employeeRepositoryStub
    )

  const result = await deleteEmployeeController.handle({
    body: {
      id: 1
    }
  })
    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return a success object if no error', async () => {
    const result = await deleteEmployeeController.handle({
      body: {
        id: 1
      }
    })
    expect(result).toEqual({
      code: 204,
      success: true
    })
  })
})