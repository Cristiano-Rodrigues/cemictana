import jwt from 'jsonwebtoken'

export class JWTHandler {
  constructor () {
    this.saltKey = process.env.SALT_KEY
  }

  generate (payload) {
    const options = {
      expiresIn: '1d'
    }
    return jwt.sign(payload, this.saltKey, options)
  }

  verify (token) {
    return jwt.verify(token, this.saltKey)
  }
}
