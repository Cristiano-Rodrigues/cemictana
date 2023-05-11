import { DuplicatedData, InvalidEntry, ServerError } from '../../errors'
import { SignUpController } from './signUp'

class ConnectionStub {
  close () {}
}
class UserRepositoryStub {
  async getByEmail (email) {
    return null
  }
  async create (user) {}
}
class ResponsibleRepositoryStub {
  async getByIdentification (identification) {
    return null
  }
  async create (responsible) {}
}
class HasherStub {
  hash (password, saltKey) {
    return 'hashed_password'
  }
}
class MailerStub {
  async send (data) {}
}

const signUpController = new SignUpController(
  ConnectionStub,
  UserRepositoryStub,
  ResponsibleRepositoryStub,
  HasherStub,
  MailerStub
)

describe('SignUpController', () => {
  test('Should return an error object if any null value is given', async () => {
    const response = await signUpController.handle({
      body: {
        name: null,
        identification: 'any_identification',
        email: 'email@server.com',
        password: 'any_password'
      }
    })
    expect(response).toEqual({
      code: 400,
      error: new InvalidEntry('name, identification, email, password')
    })
  })

  test('Should return an error object if user email is already registered', async () => {
    class UserRepositoryStub {
      async getByEmail (email) {
        return {
          email
        }
      }
    }
    const signUpController = new SignUpController(
      ConnectionStub,
      UserRepositoryStub,
      ResponsibleRepositoryStub,
      HasherStub,
      MailerStub
    )

    const response = await signUpController.handle({
      body: {
        name: 'any_name',
        identification: 'any_identification',
        email: 'email@server.com',
        password: 'any_password'
      }
    })

    expect(response).toEqual({
      code: 400,
      error: new DuplicatedData('email')
    })
  })

  test('Should return an error object if identification is already registered', async () => {
    class ResponsibleRepositoryStub {
      async getByIdentification (identification) {
        return {
          identification
        }
      }
    }
    const signUpController = new SignUpController(
      ConnectionStub,
      UserRepositoryStub,
      ResponsibleRepositoryStub,
      HasherStub,
      MailerStub
    )

    const response = await signUpController.handle({
      body: {
        name: 'any_name',
        identification: 'any_identification',
        email: 'email@server.com',
        password: 'any_password'
      }
    })

    expect(response).toEqual({
      code: 400,
      error: new DuplicatedData('identification')
    })
  })

  test('Should return an error object if any error is thrown', async () => {
    class UserRepositoryStub {
      async create (user) {
        throw new Error('any_error')
      }
    }

    const signUpController = new SignUpController(
      ConnectionStub,
      UserRepositoryStub,
      ResponsibleRepositoryStub,
      HasherStub,
      MailerStub
    )

    const response = await signUpController.handle({
      body: {
        name: 'any_name',
        identification: 'any_identification',
        email: 'email@server.com',
        password: 'any_password'
      }
    })

    expect(response).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return success object if no error is thrown', async () => {
    const response = await signUpController.handle({
      body: {
        name: 'any_name',
        identification: 'any_identification',
        email: 'email@server.com',
        password: 'any_password'
      }
    })

    expect(response).toEqual({
      code: 201,
      success: true
    })
  })
})