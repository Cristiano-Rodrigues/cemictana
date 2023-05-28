import { Unauthorized, Forbidden } from './errors'

const sendUnauthorized = () => ({
  code: 401,
  error: new Unauthorized()
})

const sendForbidden = () => ({
  code: 403,
  error: new Forbidden()
})

export class SessionAuthentication {
  constructor (allowedPermissions) {
    this.allowedPermissions = allowedPermissions
  }

  async handle (req) {
    if (this.allowedPermissions.includes('*')) {
      return {
        success: true
      }
    }

    if (!req.session?.user) {
      return sendUnauthorized()
    }

    const user = req.session.user
    if (!this.allowedPermissions.includes(user.permission)) {
      return sendForbidden()
    }

    return {
      success: true
    }
  }
}