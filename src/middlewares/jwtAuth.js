import { Unauthorized } from './errors/unauthorized.js'
import { getToken } from './helpers/jwt.js'

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
