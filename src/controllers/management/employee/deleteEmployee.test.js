import { InvalidEntry, ServerError } from '../../errors/'
import { DeleteEmployeeController } from './deleteEmployee'

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
    const EmployeeRepositoryStub = class {
      delete () {
        throw new Error('any_error')
      }
    }
    const deleteEmployeeController = new DeleteEmployeeController(
      ConnectionStub,
      EmployeeRepositoryStub
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