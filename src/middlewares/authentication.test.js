import { Authentication } from './authentication'
import { Unauthorized } from './errors/unauthorized'

class JWTHandlerStub {
  verify (token) {
    return true
  }
}
const authentication = new Authentication(JWTHandlerStub)

describe('Authentication', () => {
  it('Should call JWTHandler.verify method with correct params', async () => {
    class JWTHandlerStub {
      verify (token) {
        expect(token).toBe('valid_token')
      }
    }
    const authentication = new Authentication(JWTHandlerStub)
    await authentication.handle({
      body: {
        token: 'valid_token'
      }
    })
  })

  it('Should return Unauthorized error if an invalid token is given', async () => {
    class JWTHandlerStub {
      verify (token) {
        return null
      }
    }
    const authentication = new Authentication(JWTHandlerStub)
    const response = await authentication.handle({
      body: {
        token: 'invalid_token'
      }
    })
    expect(response).toEqual({
      code: 401,
      error: new Unauthorized()
    })
  })

  it('Should return Unauthorized error if any error is thrown while decoding token', async () => {
    class JWTHandlerStub {
      verify (token) {
        throw new Error('any_error')
      }
    }
    const authentication = new Authentication(JWTHandlerStub)
    const response = await authentication.handle({})

    expect(response).toEqual({
      code: 401,
      error: new Unauthorized()
    })
  })

  it('Should return a success object if no error', async () => {
    const response = await authentication.handle({
      body: {
        token: 'valid_token'
      }
    })
    
    expect(response).toEqual({
      success: true
    })
  })
})