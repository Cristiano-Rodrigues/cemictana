import { body, param } from 'express-validator'

export const createEmployeeValidation = [
  body('name').notEmpty().isString(),
  body('identification').notEmpty().isString(),
  body('post').notEmpty().isString(),
  body('bornDate').optional().isDate({
    format: 'YYYY-MM-DD',
    strictMode: true
  }),
  body('address').optional().isString()
]

export const updateEmployeeValidation = [
  body('id').notEmpty().isNumeric(),
  body('name').notEmpty().isString(),
  body('identification').notEmpty().isString(),
  body('post').notEmpty().isString(),
  body('bornDate').optional().isDate({
    format: 'YYYY-MM-DD',
    strictMode: true
  }),
  body('address').optional().isString()
]

export const deleteEmployeeValidation = [
  param('id').notEmpty().isNumeric()
]