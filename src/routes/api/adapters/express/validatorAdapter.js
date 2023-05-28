import { validationResult } from 'express-validator'

export class Validator {
  constructor (req) {
    this.req = req
  }

  async validate (validations) {
    for (let validation of validations) {
      const result = await validation.run(this.req)
      if (result.errors.length) break
    }

    const errors = validationResult(this.req)
    
    if (errors.isEmpty()) {
      return {
        isValid: true
      }
    }

    return {
      error: {
        name: errors.array()[0]?.path
      }
    }
  }
}