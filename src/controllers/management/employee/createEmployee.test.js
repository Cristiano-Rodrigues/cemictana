import { DuplicatedData, InvalidEntry , ServerError } from '../../errors/'
import { CreateEmployeeController } from './createEmployee'

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

const tomorrow = () => {
  const d = new Date()
  const datestring = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() + 1}`
  return datestring
}

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

  test('Should return an error object if given bornDate is after current date', async () => {
    const result = await createEmployeeController.handle({
      body: {
        name: 'any_name',
        identification: 'any_identification',
        post: 'any_post',
        bornDate: tomorrow()
      }
    })
    expect(result).toEqual({
      code: 400,
      error: new InvalidEntry('bornDate')
    })
  })

  test('Should return an error object if employee already exists', async () => {
    const EmployeeRepositoryStub = class {
      getByIdentification (identification) {
        return {
          identification
        }
      }
    }
    const createEmployeeController = new CreateEmployeeController(
      ConnectionStub,
      EmployeeRepositoryStub
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

  test('Should return an error object if any internal server error', async () => {
    const EmployeeRepositoryStub = class {
      getByIdentification (_) {
        throw new Error('any_error')
      }
    }
    const createEmployeeController = new CreateEmployeeController(
      ConnectionStub,
      EmployeeRepositoryStub
    )

    const result = await createEmployeeController.handle({
      body: {
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