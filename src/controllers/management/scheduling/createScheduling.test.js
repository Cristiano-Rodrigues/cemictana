import { InvalidEntry , SchedulingLimit, InvalidTiming, ServerError } from '../../errors/'
import { CreateSchedulingController } from './createScheduling'

const ConnectionStub = class {
  close () {}
}
const SchedulingRepositoryStub = class {
  async get () {
    return []
  }
  async create () {}
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
  DefunctRepositoryStub,
  UnitRepositoryStub
)

const tomorrow = () => {
  const d = new Date()
  const datestring = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() + 1} 06:00:00`
  return datestring
}

describe('CreateSchedulingController', () => {
  test('Should return an error object if null is given for any required value', async () => {
    const result = await createSchedulingController.handle({
      body: {
        type: null,
        schedulingDate: '2023-04-06 06:00:00',
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
        schedulingDate: '2023-04-06 06:00:00',
        defunct: 1,
        unit: 1
      }
    })
    expect(result).toEqual({
      code: 400,
      error: new InvalidEntry('schedulingDate')
    })
  })

  test('Should return an error object if given schedulingDate is out office hours', async () => {
    const date = new Date(tomorrow())
    date.setHours(2)

    const result = await createSchedulingController.handle({
      body: {
        type: 'any_type',
        schedulingDate: date.toString(),
        defunct: 1,
        unit: 1
      }
    })
    expect(result).toEqual({
      code: 400,
      error: new InvalidTiming()
    })
  })

  test('Should return an error object if scheduling limit for some date exceeded', async () => {
    const date = tomorrow()
    const fakeScheduling = date => ({ schedulingDate: date })
    const SchedulingRepositoryStub = class {
      async get () {
        const fakeSchedulings = []
        for (let i = 0; i <= 10; i++) {
          fakeSchedulings.push(fakeScheduling(date))
        }
        return fakeSchedulings
      }
    }
    const createSchedulingController = new CreateSchedulingController(
      ConnectionStub,
      SchedulingRepositoryStub,
      DefunctRepositoryStub,
      UnitRepositoryStub
    )
    const result = await createSchedulingController.handle({
      body: {
        type: 'any_type',
        schedulingDate: date,
        defunct: 1,
        unit: 1
      }
    })
    expect(result).toEqual({
      code: 400,
      error: new SchedulingLimit()
    })
  })

  test('Should return an error object if invalid id is given for responsible, defunct or unit', async () => {
    const DefunctRepositoryStub = class {
      getById (_) {
        return null
      }
    }
    const createSchedulingController = new CreateSchedulingController(
      ConnectionStub,
      SchedulingRepositoryStub,
      DefunctRepositoryStub,
      UnitRepositoryStub
    )

    const result = await createSchedulingController.handle({
      body: {
        type: 'any_type',
        schedulingDate: tomorrow(),
        defunct: null,
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
    const createSchedulingController = new CreateSchedulingController(
      ConnectionStub,
      SchedulingRepositoryStub,
      DefunctRepositoryStub,
      UnitRepositoryStub
    )

    const result = await createSchedulingController.handle({
      body: {
        type: 'any_type',
        schedulingDate: tomorrow(),
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