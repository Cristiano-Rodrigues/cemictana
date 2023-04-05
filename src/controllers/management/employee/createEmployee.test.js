import { DuplicatedData } from '../../errors/duplicatedData.js'
import { InvalidEntry } from '../../errors/invalidEntry.js'
import { CreateEmployeeController } from './createEmployee.js'

const ConnectionStub = class {
  close () {}
}
const EmployeeRepositoryStub = class {
  async getByIdentification () {
    return null
  }
  async create () {}
}

const createEmployeeController = new CreateEmployeeController(
  ConnectionStub,
  EmployeeRepositoryStub
)

describe('CreateEmployeeController', () => {
  test('Should return an error object if null is given for any required value', async () => {
    const result = await createEmployeeController.handle({
      body: {
        name: null,
        identification: 'any_identification',
        post: 'any_post'
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof InvalidEntry)).toBe(true)
  })

  test('Should return an error object if employee already exists', async () => {
    const employeeRepositoryStub = class {
      getByIdentification (identification) {
        return {
          identification
        }
      }
    }
    const createEmployeeController = new CreateEmployeeController(
      ConnectionStub,
      employeeRepositoryStub
    )

    const result = await createEmployeeController.handle({
      body: {
        name: 'any_name',
        identification: 'any_identification',
        post: 'any_post'
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof DuplicatedData)).toBe(true)
  })

  test('Should return a success object if no error', async () => {
    const result = await createEmployeeController.handle({
      body: {
        name: 'any_name',
        identification: 'any_identification',
        post: 'any_post',
        bornDate: 'any_date',
        address: 'any_address'
      }
    })
    expect(result).toEqual({
      code: 201,
      success: true
    })
  })
})