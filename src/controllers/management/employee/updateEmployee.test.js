import { DuplicatedData } from '../../errors/duplicatedData.js'
import { InvalidEntry } from '../../errors/invalidEntry.js'
import { ServerError } from '../../errors/serverError.js'
import { UpdateEmployeeController } from './updateEmployee.js'

const ConnectionStub = class {
  close () {}
}
const EmployeeRepositoryStub = class {
  async getByIdentification (identification) {
    return {
      id: 1,
      identification
    }
  }
  async update () {}
}

const updateEmployeeController = new UpdateEmployeeController(
  ConnectionStub,
  EmployeeRepositoryStub
)

describe('UpdateEmployeeController', () => {
  test('Should return an error object if null is given for any required value', async () => {
    const result = await updateEmployeeController.handle({
      body: {
        id: null,
        name: 'any_name',
        identification: 'any_identification',
        post: 'any_post'
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof InvalidEntry)).toBe(true)
  })

  test('Should return an error object if employee identification is already used by other user', async () => {
    const employeeRepositoryStub = class {
      getByIdentification (identification) {
        return {
          id: 2,
          identification
        }
      }
    }
    const updateEmployeeController = new UpdateEmployeeController(
      ConnectionStub,
      employeeRepositoryStub
    )

    const result = await updateEmployeeController.handle({
      body: {
        id: 1,
        name: 'any_name',
        identification: 'any_identification',
        post: 'any_post'
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof DuplicatedData)).toBe(true)
  })

  test('Should return an error object if any internal server error', async () => {
    const employeeRepositoryStub = class {
      getByIdentification (_) {
        throw new Error('any_error')
      }
    }
    const updateEmployeeController = new UpdateEmployeeController(
      ConnectionStub,
      employeeRepositoryStub
    )

    const result = await updateEmployeeController.handle({
      body: {
        id: 1,
        name: 'any_name',
        identification: 'any_identification',
        post: 'any_post'
      }
    })
    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return a success object if no error', async () => {
    const result = await updateEmployeeController.handle({
      body: {
        id: 1,
        name: 'any_name',
        identification: 'any_identification',
        post: 'any_post',
        bornDate: 'any_date',
        address: 'any_address'
      }
    })
    expect(result).toEqual({
      code: 200,
      success: true
    })
  })
})