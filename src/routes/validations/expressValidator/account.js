import { body} from 'express-validator'

export const loginValidation = [
  body('email').notEmpty().isEmail(),
  body('password').notEmpty().isString()
]