import { InvalidEntry, ServerError } from '../controllers/errors'

export class Validation {
  constructor (Validator, validations) {
    this.Validator = Validator
    this.validations = validations
  }

  async handle (req) {
    const validator = new this.Validator(req)
    
    try {
      const result = await validator.validate(this.validations)

      if (result.isValid) {
        return {
          success: true
        }
      }

      const invalidField = result.error.name

      return {
        code: 400,
        error: new InvalidEntry(invalidField)
      }
    } catch (error) {
      return {
        code: 500,
        error: new ServerError()
      }
    }
  }
}