import { body, param } from 'express-validator'

export const createUnitValidation = [
  body('type').notEmpty().isString(),
  body('location').notEmpty().isString(),
  body('state').optional().isBoolean()
]

export const updateUnitValidation = [
  body('id').notEmpty().isNumeric(),
  body('type').notEmpty().isString(),
  body('location').notEmpty().isString(),
  body('state').optional().isBoolean()
]

export const deleteUnitValidation = [
  param('id').notEmpty().isNumeric()
]