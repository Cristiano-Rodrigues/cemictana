import { ServerError } from '../../errors'
import { GetSchedulingsByUserController } from './getSchedulingsByUser'

const ConnectionStub = class {
  close () {}
}
const SchedulingRepository = class {
  async getByUser () {
    return []
  }
}
const JWTHandlerStub = class {
  verify () {
    return {}
  }
}

const getSchedulingsByUserController = new GetSchedulingsByUserController(
  ConnectionStub,
  SchedulingRepository,
  JWTHandlerStub
)

describe('GetSchedulingsByUserController', () => {
  test('Should return an error object if any internal server error', async () => {
    const SchedulingRepository = class {
      getByUser () {
        throw new Error('any_error')
      }
    }
    const getSchedulingsByUserController = new GetSchedulingsByUserController(
      ConnectionStub,
      SchedulingRepository,
      JWTHandlerStub
    )

    const result = await getSchedulingsByUserController.handle({
      body: {
        token: 'any_token'
      }
    })
    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return a success object if no error', async () => {
    const result = await getSchedulingsByUserController.handle({
      body: {
        token: 'any_token'
      }
    })
    expect(result).toEqual({
      code: 200,
      success: true,
      result: []
    })
  })
})