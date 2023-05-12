import { ServerError } from '../../errors'
import { SearchDefunctNameController } from './searchDefunctName'

const ConnectionStub = class {
  close () {}
}
const DefunctRepositoryStub = class {
  async searchByName () {
    return []
  }
}

const searchDefunctNameController = new SearchDefunctNameController(
  ConnectionStub,
  DefunctRepositoryStub
)

describe('SearchDefunctNameController', () => {
  test('Should return an error object if any internal server error', async () => {
    const DefunctRepositoryStub = class {
      searchByName () {
        throw new Error('any_error')
      }
    }
    const searchDefunctNameController = new SearchDefunctNameController(
      ConnectionStub,
      DefunctRepositoryStub
    )

    const result = await searchDefunctNameController.handle({
      query: {
        search: 'any_search'
      }
    })
    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return a success object if no error', async () => {
    const result = await searchDefunctNameController.handle({
      query: {
        search: 'any_search'
      }
    })

    expect(result).toEqual({
      code: 200,
      success: true,
      result: []
    })
  })
})