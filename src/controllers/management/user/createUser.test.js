import { DuplicatedData, InvalidEntry , ServerError } from '../../errors/'
import { CreateUserController } from './createUser'

const ConnectionStub = class {
  close () {}
}
const UserRepositoryStub = class {
  async getByEmail () {
    return null
  }
  async create () {}
}
const HasherStub = class {
  hash (password, saltKey) {
    return 'hashed_password'
  }
}
const MailerStub = class {
  async send (_) {}
}

const createUserController = new CreateUserController(
  ConnectionStub,
  UserRepositoryStub,
  HasherStub,
  MailerStub
)

describe('CreateUserController', () => {
  test('Should return an error object if null is given for any required value', async () => {
    const result = await createUserController.handle({
      body: {
        name: null,
        email: 'email@server.com',
        password: 'any_password',
        permission: 'any_permission'
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof InvalidEntry)).toBe(true)
  })

  test('Should return an error object if user already exists', async () => {
    const UserRepositoryStub = class {
      getByEmail (email) {
        return {
          email
        }
      }
    }
    const createUserController = new CreateUserController(
      ConnectionStub,
      UserRepositoryStub,
      HasherStub,
      MailerStub
    )

    const result = await createUserController.handle({
      body: {
        name: 'any_name',
        email: 'email@server.com',
        password: 'any_password',
        permission: 'any_permission'
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof DuplicatedData)).toBe(true)
  })

  test('Should return an error object if any internal server error', async () => {
    const UserRepositoryStub = class {
      getByEmail (_) {
        throw new Error('any_error')
      }
    }
    const createUserController = new CreateUserController(
      ConnectionStub,
      UserRepositoryStub,
      HasherStub,
      MailerStub
    )

    const result = await createUserController.handle({
      body: {
        name: 'any_name',
        email: 'email@server.com',
        password: 'any_password',
        permission: 'any_permission'
      }
    })
    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should call Hasher.hash with correct params', async () => {
    const HasherStub = class {
      hash (password, saltKey) {
        expect(password).toBe('any_password')
        expect(saltKey).toBe(10)
      }
    }

    const createUserController = new CreateUserController(
      ConnectionStub,
      UserRepositoryStub,
      HasherStub,
      MailerStub
    )

    await createUserController.handle({
      body: {
        name: 'any_name',
        email: 'email@server.com',
        password: 'any_password',
        permission: 'any_permission'
      }
    })
  })

  test('Should return a success object if no error', async () => {
    const result = await createUserController.handle({
      body: {
        name: 'any_name',
        email: 'email@server.com',
        password: 'any_password',
        permission: 'any_permission'
      }
    })
    expect(result).toEqual({
      code: 201,
      success: true,
      user: {
        name: 'any_name',
        email: 'email@server.com',
        permission: 'any_permission'
      }
    })
  })
})