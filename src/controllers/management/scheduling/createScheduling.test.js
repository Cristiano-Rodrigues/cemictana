import { InvalidEntry , ServerError } from '../../errors/'
import { CreateSchedulingController } from './createScheduling'

const ConnectionStub = class {
  close () {}
}
const SchedulingRepositoryStub = class {
  async create () {}
}
const ResponsibleRepositoryStub = class {
  async getById(id) {
    return id
  }
}
const DefunctRepositoryStub = class {
  async getById(id) {
    return id
  }
}
const UnitRepositoryStub = class {
  async getById(id) {
    return id
  }
}
const createSchedulingController = new CreateSchedulingController(
  ConnectionStub,
  SchedulingRepositoryStub,
  ResponsibleRepositoryStub,
  DefunctRepositoryStub,
  UnitRepositoryStub
)

const tomorrow = () => {
  const d = new Date()
  const datestring = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() + 1}`
  return datestring
}

describe('CreateSchedulingController', () => {
  test('Should return an error object if null is given for any required value', async () => {
    const result = await createSchedulingController.handle({
      body: {
        type: null,
        schedulingDate: '2023-04-06',
        responsible: 1,
        defunct: 1,
        unit: 1
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof InvalidEntry)).toBe(true)
  })

  test('Should return an error object if given schedulingDate is before current date', async () => {
    const result = await createSchedulingController.handle({
      body: {
        type: 'any_type',
        schedulingDate: '2023-04-06',
        responsible: 1,
        defunct: 1,
        unit: 1
      }
    })
    expect(result).toEqual({
      code: 400,
      error: new InvalidEntry('schedulingDate')
    })
  })

  test('Should return an error object if invalid id is given for responsible, defunct or unit', async () => {
    const ResponsibleRepositoryStub = class {
      getById (_) {
        return null
      }
    }
    const createSchedulingController = new CreateSchedulingController(
      ConnectionStub,
      SchedulingRepositoryStub,
      ResponsibleRepositoryStub,
      DefunctRepositoryStub,
      UnitRepositoryStub
    )

    const result = await createSchedulingController.handle({
      body: {
        type: 'any_type',
        schedulingDate: tomorrow(),
        responsible: 'non-existing-id',
        defunct: 1,
        unit: 1
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof InvalidEntry)).toBe(true)
  })

  test('Should return an error object if any internal server error', async () => {
    const ResponsibleRepositoryStub = class {
      getById (_) {
        throw new Error('any_error')
      }
    }
    const createSchedulingController = new CreateSchedulingController(
      ConnectionStub,
      SchedulingRepositoryStub,
      ResponsibleRepositoryStub,
      DefunctRepositoryStub,
      UnitRepositoryStub
    )

    const result = await createSchedulingController.handle({
      body: {
        type: 'any_type',
        schedulingDate: tomorrow(),
        responsible: 1,
        defunct: 1,
        unit: 1
      }
    })
    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return a success object if no error', async () => {
    const result = await createSchedulingController.handle({
      body: {
        type: 'any_type',
        schedulingDate: tomorrow(),
        responsible: 1,
        defunct: 1,
        unit: 1
      }
    })
    expect(result).toEqual({
      code: 201,
      success: true
    })
  })
})