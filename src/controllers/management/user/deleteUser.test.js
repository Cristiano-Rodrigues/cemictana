import { InvalidEntry, ServerError } from '../../errors/'
import { DeleteUserController } from './deleteUser'

const ConnectionStub = class {
  close () {}
}
const UserRepositoryStub = class {
  async delete () {}
}

const deleteUserController = new DeleteUserController(
  ConnectionStub,
  UserRepositoryStub
)

describe('DeleteUserController', () => {
  test('Should return an error object if no id is provided', async () => {
    const result = await deleteUserController.handle({})
    expect(result).toEqual({
      code: 400,
      error: new InvalidEntry('id')
    })
  })

  test('Should return an error object if any internal server error', async () => {
    const UserRepositoryStub = class {
      delete () {
        throw new Error('any_error')
      }
    }
    const deleteUserController = new DeleteUserController(
      ConnectionStub,
      UserRepositoryStub
    )

    const result = await deleteUserController.handle({
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
    const result = await deleteUserController.handle({
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