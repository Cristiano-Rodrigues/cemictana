import { body, param, query } from 'express-validator'

export const searchDefunctNameValidation = [
  query('search').isString()
]

export const createDefunctValidation = [
  body('name').notEmpty().isString(),
  body('identification').notEmpty().isString(),
  body('responsible').notEmpty().isNumeric(),
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
  body('responsible').notEmpty().isNumeric(),
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