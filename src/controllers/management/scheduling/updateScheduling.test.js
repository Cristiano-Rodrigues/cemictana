import { InvalidEntry , ServerError } from '../../errors/'
import { UpdateSchedulingController } from './updateScheduling'

const ConnectionStub = class {
  close () {}
}
const SchedulingRepositoryStub = class {
  async update () {}
}
const DefunctRepositoryStub = class {
  async getById (id) {
    return { id }
  }
}
const UnitRepositoryStub = class {
  async getById (id) {
    return { id }
  }
}
const EmployeeRepositoryStub = class {
  async getById (id) {
    return { id }
  }
}

const updateSchedulingController = new UpdateSchedulingController(
  ConnectionStub,
  SchedulingRepositoryStub,
  DefunctRepositoryStub,
  UnitRepositoryStub,
  EmployeeRepositoryStub
)

const tomorrow = () => {
  const d = new Date()
  const datestring = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() + 1}`
  return datestring
}

describe('UpdateSchedulingController', () => {
  test('Should return an error object if null is given for any required value', async () => {
    const result = await updateSchedulingController.handle({
      body: {
        id: null,
        type: 'any_type',
        schedulingDate: '2023-04-06',
        defunct: 1,
        employee: 1,
        unit: 1
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof InvalidEntry)).toBe(true)
  })

  test('Should return an error object if given schedulingDate is before current date', async () => {
    const result = await updateSchedulingController.handle({
      body: {
        id: 1,
        type: 'any_type',
        schedulingDate: '2023-04-06',
        defunct: 1,
        employee: 1,
        unit: 1
      }
    })
    expect(result).toEqual({
      code: 400,
      error: new InvalidEntry('schedulingDate')
    })
  })

  test('Should return an error object if invalid id is given for defunct, employee or unit', async () => {
    const DefunctRepositoryStub = class {
      getById (_) {
        return null
      }
    }
    const updateSchedulingController = new UpdateSchedulingController(
      ConnectionStub,
      SchedulingRepositoryStub,
      DefunctRepositoryStub,
      UnitRepositoryStub,
      EmployeeRepositoryStub
    )

    const result = await updateSchedulingController.handle({
      body: {
        id: 1,
        type: 'any_type',
        schedulingDate: tomorrow(),
        defunct: null,
        employee: 1,
        unit: 1
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof InvalidEntry)).toBe(true)
  })

  test('Should return an error object if any internal server error', async () => {
    const DefunctRepositoryStub = class {
      getById (_) {
        throw new Error('any_error')
      }
    }
    const updateSchedulingController = new UpdateSchedulingController(
      ConnectionStub,
      SchedulingRepositoryStub,
      DefunctRepositoryStub,
      UnitRepositoryStub,
      EmployeeRepositoryStub
    )

    const result = await updateSchedulingController.handle({
      body: {
        id: 1,
        type: 'any_type',
        schedulingDate: tomorrow(),
        defunct: 1,
        employee: 1,
        unit: 1
      }
    })
    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return a success object if no error', async () => {
    const result = await updateSchedulingController.handle({
      body: {
        id: 1,
        type: 'any_type',
        schedulingDate: tomorrow(),
        defunct: 1,
        employee: 1,
        unit: 1
      }
    })
    expect(result).toEqual({
      code: 200,
      success: true
    })
  })
})