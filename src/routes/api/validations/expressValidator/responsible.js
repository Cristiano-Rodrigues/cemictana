import { body, param } from 'express-validator'

export const updateResponsibleValidation = [
  body('id').notEmpty().isNumeric(),
  body('name').notEmpty().isString(),
  body('identification').notEmpty().isString(),
  body('bornDate').optional().isDate({
    format: 'YYYY-MM-DD',
    strictMode: true
  }),
  body('address').optional().isString()
]