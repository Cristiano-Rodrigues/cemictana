import { body} from 'express-validator'

export const signUpValidation = [
  body('name').notEmpty().isString(),
  body('identification').notEmpty().isString(),
  body('email').notEmpty().isEmail(),
  body('password').notEmpty().isString()
]

export const loginValidation = [
  body('email').notEmpty().isEmail(),
  body('password').notEmpty().isString()
]