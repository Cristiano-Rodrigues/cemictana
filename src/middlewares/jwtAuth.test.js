import { JWTAuthentication } from './jwtAuth'
import { Unauthorized, Forbidden } from './errors'

class JWTHandlerStub {
  verify (token) {
    return {
      permission: 'user'
    }
  }
}
const authentication = new JWTAuthentication(JWTHandlerStub, ['*'])
const req = {
  body: {
    token: 'valid_token'
  }
}

describe('JWTAuthentication', () => {
  test('Should call JWTHandler.verify method with correct params', async () => {
    class JWTHandlerStub {
      verify (token) {
        expect(token).toBe('valid_token')
      }
    }
    const authentication = new JWTAuthentication(JWTHandlerStub, ['*'])
    await authentication.handle(req)
  })

  test('Should return Unauthorized error if an invalid token is given', async () => {
    class JWTHandlerStub {
      verify (token) {
        return null
      }
    }
    const authentication = new JWTAuthentication(JWTHandlerStub, ['*'])
    const response = await authentication.handle(req)

    expect(response).toEqual({
      code: 401,
      error: new Unauthorized()
    })
  })

  test('Should return Unauthorized error if any error is thrown while decoding token', async () => {
    class JWTHandlerStub {
      verify (token) {
        throw new Error('any_error')
      }
    }
    const authentication = new JWTAuthentication(JWTHandlerStub, ['*'])
    const response = await authentication.handle(req)

    expect(response).toEqual({
      code: 401,
      error: new Unauthorized()
    })
  })

  test('Should return Forbidden Error if permission is not allowed', async () => {
    const authentication = new JWTAuthentication(JWTHandlerStub, ['admin'])
    const response = await authentication.handle(req)

    expect(response).toEqual({
      code: 403,
      error: new Forbidden()
    })
  })

  test('Should return a success object if no error', async () => {
    const response = await authentication.handle(req)
    
    expect(response).toEqual({
      success: true
    })
  })
})