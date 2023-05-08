import { ServerError } from '../../errors/serverError'
import { Unauthorized } from '../../errors/unauthorized'
import { LoginController } from './login'

class ConnectionStub {
  close () {}  
}
class UserRepositoryStub {
  getByEmail () {
    return {
      id: 1,
      name: 'any_name',
      email: 'email@server.com',
      permission: 'any_permission',
      state: 1
    }
  }
}
class HasherStub {
  compare (password, hash) {
    return true
  }
}
class JWTHandlerStub {
  generate (payload) {
    return 'any_valid_token'
  }
}
const req = {
  body: {
    email: 'email@server.com',
    password: 'any_password'
  },
  session: {}
}
const unauthorized = field => ({
  code: 401,
  error: new Unauthorized(field)
})

const loginController = new LoginController(
  ConnectionStub,
  UserRepositoryStub,
  HasherStub,
  JWTHandlerStub
)

describe('LoginController', () => {
  test('Should return Unauthorized object if user email is not found', async () => {
    class UserRepositoryStub {
      getByEmail (email) {
        return null
      } 
    }
    const loginController = new LoginController(
      ConnectionStub,
      UserRepositoryStub,
      HasherStub,
      JWTHandlerStub
    )
    const response = await loginController.handle(req)
    expect(response).toEqual(unauthorized('email'))
  })

  test('Should return Unauthorized object if wrong password is given', async () => {
    class HasherStub {
      compare (password, hash) {
        return false
      } 
    }
    const loginController = new LoginController(
      ConnectionStub,
      UserRepositoryStub,
      HasherStub,
      JWTHandlerStub
    )
    const response = await loginController.handle(req)
    expect(response).toEqual(unauthorized('password'))
  })

  test('Should call JWTHandler with correct params', async () => {
    class JWTHandlerStub {
      generate (payload) {
        expect(payload).toEqual({
          id: 1,
          permission: 'any_permission',
          email: 'email@server.com'
        })
      } 
    }
    const loginController = new LoginController(
      ConnectionStub,
      UserRepositoryStub,
      HasherStub,
      JWTHandlerStub
    )
    await loginController.handle(req)
  })

  test('Should set session object correctly', async () => {
    await loginController.handle(req)
    expect(req.session.user).toEqual({
      id: 1,
      name: 'any_name',
      email: 'email@server.com',
      permission: 'any_permission',
      state: 1
    })
  })

  test('Should return a server error if any error is thrown', async () => {
    class ConnectionStub {
      constructor () {
        throw new Error('any_error')
      }
    }
    const loginController = new LoginController(
      ConnectionStub,
      UserRepositoryStub,
      HasherStub,
      JWTHandlerStub
    )
    const response = await loginController.handle(req)
    expect(response).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return a success object if login succeds', async () => {
    const response = await loginController.handle(req)
    expect(response.code).toBe(200)
    expect(response.success).toBe(true)
  })
})