import { ServerError } from '../../errors/'
import { GetResponsiblesController } from './getResponsible'

const ConnectionStub = class {
  close () {}
}
const ResponsibleRepositoryStub = class {
  async get () {
    return []
  }
}

const getResponsiblesController = new GetResponsiblesController(
  ConnectionStub,
  ResponsibleRepositoryStub
)

describe('GetResponsiblesController', () => {
  test('Should return an error object if any internal server error', async () => {
    const ResponsibleRepositoryStub = class {
      get () {
        throw new Error('any_error')
      }
    }
    const getResponsiblesController = new GetResponsiblesController(
      ConnectionStub,
      ResponsibleRepositoryStub
    )

    const result = await getResponsiblesController.handle()
    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return a success object if no error', async () => {
    const result = await getResponsiblesController.handle()
    expect(result).toEqual({
      code: 200,
      success: true,
      result: []
    })
  })
})