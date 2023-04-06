import { InvalidEntry, ServerError } from '../../errors/'
import { DeleteUnitController } from './deleteUnit'

const ConnectionStub = class {
  close () {}
}
const UnitRepositoryStub = class {
  async delete () {}
}

const deleteUnitController = new DeleteUnitController(
  ConnectionStub,
  UnitRepositoryStub
)

describe('DeleteUnitController', () => {
  test('Should return an error object if no id is provided', async () => {
    const result = await deleteUnitController.handle({})
    expect(result).toEqual({
      code: 400,
      error: new InvalidEntry('id')
    })
  })

  test('Should return an error object if any internal server error', async () => {
    const UnitRepositoryStub = class {
      delete () {
        throw new Error('any_error')
      }
    }
    const deleteUnitController = new DeleteUnitController(
      ConnectionStub,
      UnitRepositoryStub
    )

    const result = await deleteUnitController.handle({
      params: {
        id: 1
      }
    })
    
    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return a success object if no error', async () => {
    const result = await deleteUnitController.handle({
      params: {
        id: 1
      }
    })
    expect(result).toEqual({
      code: 204,
      success: true
    })
  })
})