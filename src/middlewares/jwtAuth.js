import { Unauthorized } from './errors/unauthorized'
import { getToken } from '../utils/jwt'

const sendError = () => ({
  code: 401,
  error: new Unauthorized()
})

export class JWTAuthentication {
  constructor (JWTHandler) {
    this.jwthandler = new JWTHandler()
  }

  async handle (req) {
    try {
      const decoded = this.jwthandler.verify(getToken(req))

      if (!decoded) {
        return sendError()
      }
    } catch (error) {
      return sendError()
    }

    return {
      success: true
    }
  }
}
