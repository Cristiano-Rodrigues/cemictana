import { Unauthorized, Forbidden } from './errors'
import { getToken } from '../utils/jwt'

const sendUnauthorized = () => ({
  code: 401,
  error: new Unauthorized()
})

const sendForbidden = () => ({
  code: 403,
  error: new Forbidden()
})

export class JWTAuthentication {
  constructor (JWTHandler, allowedPermissions) {
    this.jwthandler = new JWTHandler()
    this.allowedPermissions = allowedPermissions
  }

  async handle (req) {
    try {
      const payload = this.jwthandler.verify(getToken(req))

      if (!payload) {
        return sendUnauthorized()
      }

      if (this.allowedPermissions.includes('*')) {
        return {
          success: true
        }
      }

      if (!this.allowedPermissions.includes(payload.permission)) {
        return sendForbidden()
      }

    } catch (error) {
      return sendUnauthorized()
    }

    return {
      success: true
    }
  }
}
