import { ServerError } from '../../errors'
import { GetDefunctsByUserController } from './getDefunctsByUser'

const ConnectionStub = class {
  close () {}
}
const DefunctRepositoryStub = class {
  async getByUser () {
    return []
  }
}
const JWTHandlerStub = class {
  verify () {
    return {}
  }
}

const getDefunctsByUserController = new GetDefunctsByUserController(
  ConnectionStub,
  DefunctRepositoryStub,
  null,
  JWTHandlerStub
)

describe('GetDefunctsByUserController', () => {
  test('Should return an error object if any internal server error', async () => {
    const DefunctRepositoryStub = class {
      getByUser () {
        throw new Error('anynullerror')
      }
    }
    const getDefunctsByUserController = new GetDefunctsByUserController(
      ConnectionStub,
      DefunctRepositoryStub,
      null,
      JWTHandlerStub
    )

    const result = await getDefunctsByUserController.handle({
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
    const result = await getDefunctsByUserController.handle({
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