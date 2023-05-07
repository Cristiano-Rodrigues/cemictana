import { body, param } from 'express-validator'

export const createUserValidation = [
  body('name').notEmpty().isString(),
  body('email').notEmpty().isEmail(),
  body('password').notEmpty().isString(),
  body('permission').notEmpty().isString()
]

export const updateUserValidation = [
  body('id').notEmpty().isString(),
  body('name').notEmpty().isString(),
  body('email').notEmpty().isEmail(),
  body('password').notEmpty().isString(),
  body('permission').notEmpty().isString()
]

export const deleteUserValidation = [
  param('id').notEmpty().isNumeric()
]