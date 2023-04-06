import { ServerError } from '../../errors/'
import { GetUnitsController } from './getUnits'

const ConnectionStub = class {
  close () {}
}
const UnitRepositoryStub = class {
  async get () {
    return []
  }
}

const getUnitsController = new GetUnitsController(
  ConnectionStub,
  UnitRepositoryStub
)

describe('GetUnitsController', () => {
  test('Should return an error object if any internal server error', async () => {
    const UnitRepositoryStub = class {
      get () {
        throw new Error('any_error')
      }
    }
    const getUnitsController = new GetUnitsController(
      ConnectionStub,
      UnitRepositoryStub
    )

    const result = await getUnitsController.handle()
    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return a success object if no error', async () => {
    const result = await getUnitsController.handle()
    expect(result).toEqual({
      code: 200,
      success: true,
      result: []
    })
  })
})