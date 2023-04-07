import { ServerError } from '../../errors/'
import { GetSchedulingsController } from './getSchedulings'

const ConnectionStub = class {
  close () {}
}
const SchedulingRepositoryStub = class {
  async get () {
    return []
  }
}

const getSchedulingsController = new GetSchedulingsController(
  ConnectionStub,
  SchedulingRepositoryStub
)

describe('GetSchedulingsController', () => {
  test('Should return an error object if any internal server error', async () => {
    const SchedulingRepositoryStub = class {
      get () {
        throw new Error('any_error')
      }
    }
    const getSchedulingsController = new GetSchedulingsController(
      ConnectionStub,
      SchedulingRepositoryStub
    )

    const result = await getSchedulingsController.handle()
    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return a success object if no error', async () => {
    const result = await getSchedulingsController.handle()
    expect(result).toEqual({
      code: 200,
      success: true,
      result: []
    })
  })
})