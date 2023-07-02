import { InvalidEntry , ServerError } from '../../errors/'
import { ApprovedSchedulingController } from './approvedScheduling'

const ConnectionStub = class {
  close () {}
}
const SchedulingRepositoryStub = class {
  async getById (id) {
    return {
      id
    }
  }
  async update () {}
}

const approvedSchedulingController = new ApprovedSchedulingController(
  ConnectionStub,
  SchedulingRepositoryStub
)


describe('ApprovedSchedulingController', () => {
  test('Should return an error object if null is given for id', async () => {
    const result = await approvedSchedulingController.handle({
      body: {
        id: null,
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof InvalidEntry)).toBe(true)
  })


  test('Should return an error object if invalid id is given for scheduling', async () => {
    const SchedulingRepositoryStub = class {
      getById (_) {
        return null
      }
    }
    const approvedSchedulingController = new ApprovedSchedulingController(
      ConnectionStub,
      SchedulingRepositoryStub,
    )

    const result = await approvedSchedulingController.handle({
      body: {
        id: 'invalid_id',
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof InvalidEntry)).toBe(true)
  })

  test('Should return an error object if any internal server error', async () => {
    const SchedulingRepositoryStub = class {
      getById (_) {
        throw new Error('any_error')
      }
    }
    const approvedSchedulingController = new ApprovedSchedulingController(
      ConnectionStub,
      SchedulingRepositoryStub
    )

    const result = await approvedSchedulingController.handle({
      body: {
        id: 1,
      }
    })
    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return a success object if no error', async () => {
    const result = await approvedSchedulingController.handle({
      body: {
        id: 1,
      }
    })
    expect(result).toEqual({
      code: 200,
      success: true
    })
  })
})