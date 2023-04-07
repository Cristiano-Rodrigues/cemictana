import { ServerError } from '../../errors/'
import { GetUsersController } from './getUsers'

const ConnectionStub = class {
  close () {}
}
const UserRepositoryStub = class {
  async get () {
    return []
  }
}
const HasherStub = class {
  hash (password, saltKey) {
    return 'hashed_password'
  }
}
const MailerStub = class {
  async send (_) {}
}

const getUsersController = new GetUsersController(
  ConnectionStub,
  UserRepositoryStub,
  HasherStub,
  MailerStub
)

describe('GetUsersController', () => {
  test('Should return an error object if any internal server error', async () => {
    const UserRepositoryStub = class {
      get () {
        throw new Error('any_error')
      }
    }
    const getUsersController = new GetUsersController(
      ConnectionStub,
      UserRepositoryStub,
      HasherStub,
      MailerStub
    )

    const result = await getUsersController.handle()
    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return a success object if no error', async () => {
    const result = await getUsersController.handle()
    expect(result).toEqual({
      code: 200,
      success: true,
      result: []
    })
  })
})