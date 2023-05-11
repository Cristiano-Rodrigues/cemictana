import { body, param } from 'express-validator'

export const searchDefunctNameValidation = [
  param('search').isString()
]

export const createDefunctValidation = [
  body('name').notEmpty().isString(),
  body('identification').notEmpty().isString(),
  body('bornDate').isDate({
    format: 'YYYY-MM-DD',
    strictMode: true
  }),
  body('deathDate').isDate({
    format: 'YYYY-MM-DD',
    strictMode: true
  }),
  body('deathCause').optional().isString()
]

export const updateDefunctValidation = [
  body('id').notEmpty().isNumeric(),
  body('name').notEmpty().isString(),
  body('identification').notEmpty().isString(),
  body('bornDate').isDate({
    format: 'YYYY-MM-DD',
    strictMode: true
  }),
  body('deathDate').isDate({
    format: 'YYYY-MM-DD',
    strictMode: true
  }),
  body('deathCause').optional().isString()
]

export const deleteDefunctValidation = [
  param('id').notEmpty().isNumeric()
]