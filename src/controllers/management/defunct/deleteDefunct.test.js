import { InvalidEntry, ServerError } from '../../errors/'
import { DeleteDefunctController } from './deleteDefunct'

const ConnectionStub = class {
  close () {}
}
const DefunctRepositoryStub = class {
  async delete () {}
}

const deleteDefunctController = new DeleteDefunctController(
  ConnectionStub,
  DefunctRepositoryStub
)

describe('DeleteDefunctController', () => {
  test('Should return an error object if no id is provided', async () => {
    const result = await deleteDefunctController.handle({})
    expect(result).toEqual({
      code: 400,
      error: new InvalidEntry('id')
    })
  })

  test('Should return an error object if any internal server error', async () => {
    const DefunctRepositoryStub = class {
      delete () {
        throw new Error('any_error')
      }
    }
    const deleteDefunctController = new DeleteDefunctController(
      ConnectionStub,
      DefunctRepositoryStub
    )

    const result = await deleteDefunctController.handle({
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
    const result = await deleteDefunctController.handle({
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