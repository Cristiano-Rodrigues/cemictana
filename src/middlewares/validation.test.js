import { InvalidEntry, ServerError } from '../controllers/errors'
import { Validation } from './validation'

class ValidatorStub {
  async validate(_) {
    return {
      isValid: true
    }
  }
}
const req = {
  body: {
    any_field: 'any_value'
  }
}
const validations = ['any_validation']
const validator = new Validation(ValidatorStub, validations)

describe('Validation', () => {
  test('Should handle Validator correctly', async () => {
    class ValidatorStub {
      constructor (req) {
        expect(req).toEqual(req)
      }

      async validate(vals) {
        expect(vals).toEqual(validations)
      }
    }

    const validator = new Validation(ValidatorStub, validations)
    await validator.handle(req)
  })

  test('Should return error object if any error', async () => {
    class ValidatorStub {
      async validate(_) {
        return {
          isValid: false,
          error: {
            name: 'any_name'
          }
        }
      }
    }

    const validator = new Validation(ValidatorStub, validations)
    const result = await validator.handle(req)

    expect(result).toEqual({
      code: 400,
      error: new InvalidEntry('any_name')
    })
  })

  test('Should return error object if an error is thrown', async () => {
    class ValidatorStub {
      async validate(_) {
        throw new Error('any_message')
      }
    }

    const validator = new Validation(ValidatorStub, validations)
    const result = await validator.handle(req)

    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return success object if no error', async () => {
    const result = await validator.handle(req)
    expect(result).toEqual({
      success: true
    })
  })
})