import { ServerError } from '../../errors'
import { GetDefunctsController } from './getDefuncts'

const ConnectionStub = class {
  close () {}
}
const DefunctRepositoryStub = class {
  async get () {
    return []
  }
}

const getDefunctsController = new GetDefunctsController(
  ConnectionStub,
  DefunctRepositoryStub
)

describe('GetDefunctsController', () => {
  test('Should return an error object if any internal server error', async () => {
    const DefunctRepositoryStub = class {
      get () {
        throw new Error('any_error')
      }
    }
    const getDefunctsController = new GetDefunctsController(
      ConnectionStub,
      DefunctRepositoryStub
    )

    const result = await getDefunctsController.handle()
    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return a success object if no error', async () => {
    const result = await getDefunctsController.handle()
    expect(result).toEqual({
      code: 200,
      success: true,
      result: []
    })
  })
})