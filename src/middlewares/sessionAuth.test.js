import { Forbidden, Unauthorized } from './errors'
import { SessionAuthentication } from './sessionAuth'

describe('SessionAuthentication', () => {
  test('Should allow access for all if an * is given', async () => {
    const sessionAuth = new SessionAuthentication(['*'])
    const result = await sessionAuth.handle({})
    
    expect(result).toEqual({
      success: true
    })
  })

  test('Should send Unauthorized error if user not logged in', async () => {
    const sessionAuth = new SessionAuthentication(['admin', 'user'])
    const result = await sessionAuth.handle({})
    
    expect(result).toEqual({
      code: 401,
      error: new Unauthorized()
    })
  })

  test('Should send Forbidden error if user\'s permission is not allowed', async () => {
    const sessionAuth = new SessionAuthentication(['admin'])
    const result = await sessionAuth.handle({
      session: {
        user: {
          permission: 'user'
        }
      }
    })
    
    expect(result).toEqual({
      code: 403,
      error: new Forbidden()
    })
  })

  test('Should return success if no error is given', async () => {
    const sessionAuth = new SessionAuthentication(['admin'])
    const result = await sessionAuth.handle({
      session: {
        user: {
          permission: 'admin'
        }
      }
    })
    
    expect(result).toEqual({
      success: true
    })
  })
})