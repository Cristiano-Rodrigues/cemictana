import { InvalidEntry , ServerError } from '../../errors/'
import { UpdateUserController } from './updateUser'

const ConnectionStub = class {
  close () {}
}
const UserRepositoryStub = class {
  async getById (id) {
    return {
      id
    }
  }
  async update () {}
}
const HasherStub = class {
  hash (password, saltKey) {
    return 'hashed_password'
  }
  compare () {
    return true
  }
}

const updateUserController = new UpdateUserController(
  ConnectionStub,
  UserRepositoryStub,
  HasherStub
)

describe('UpdateUserController', () => {
  test('Should return an error object if null is given for any required value', async () => {
    const result = await updateUserController.handle({
      body: {
        id: null,
        name: 'ahy_name',
        password: 'any_password',
        permission: 'any_permission'
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof InvalidEntry)).toBe(true)
  })

  test('Should return an error object if user doesn\'t exist', async () => {
    const UserRepositoryStub = class {
      getById (_) {
        return null
      }
    }
    const updateUserController = new UpdateUserController(
      ConnectionStub,
      UserRepositoryStub,
      HasherStub
    )

    const result = await updateUserController.handle({
      body: {
        id: 1,
        name: 'any_name',
        password: 'any_password',
        permission: 'any_permission'
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof InvalidEntry)).toBe(true)
  })

  test('Should return an error object if given password and registered password are different', async () => {
    const HasherStub = class {
      compare (_, __) {
        return false
      }
    }
    const updateUserController = new UpdateUserController(
      ConnectionStub,
      UserRepositoryStub,
      HasherStub
    )

    const result = await updateUserController.handle({
      body: {
        id: 1,
        name: 'any_name',
        password: 'any_password',
        permission: 'any_permission'
      }
    })
    expect(result).toEqual({
      code: 400,
      error: new InvalidEntry('password')
    })
  })

  test('Should return an error object if any internal server error', async () => {
    const UserRepositoryStub = class {
      getById (_) {
        throw new Error('any_error')
      }
    }
    const updateUserController = new UpdateUserController(
      ConnectionStub,
      UserRepositoryStub,
      HasherStub
    )

    const result = await updateUserController.handle({
      body: {
        id: 1,
        name: 'any_name',
        password: 'any_password',
        permission: 'any_permission'
      }
    })
    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should call Hasher.hash with correct params if new password is given', async () => {
    const HasherStub = class {
      compare () { return true }
      hash (password, saltKey) {
        expect(password).toBe('any_new_password')
        expect(saltKey).toBe(10)
      }
    }

    const updateUserController = new UpdateUserController(
      ConnectionStub,
      UserRepositoryStub,
      HasherStub
    )

    await updateUserController.handle({
      body: {
        id: 1,
        name: 'any_name',
        password: 'any_password',
        permission: 'any_permission',
        newPassword: 'any_new_password'
      }
    })
  })

  test('Should return a success object if no error', async () => {
    const result = await updateUserController.handle({
      body: {
        id: 1,
        name: 'any_name',
        password: 'any_password',
        permission: 'any_permission',
        newPassword: 'any_new_password'
      }
    })
    expect(result).toEqual({
      code: 201,
      success: true
    })
  })
})