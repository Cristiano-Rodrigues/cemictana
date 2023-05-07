import { body, param } from 'express-validator'

export const createSchedulingValidation = [
  body('type').notEmpty().isString(),
  body('schedulingDate').notEmpty().isDate({
    format: 'YYYY-MM-DD',
    strictMode: true
  }),
  body('responsible').notEmpty().isNumeric(),
  body('defunct').notEmpty().isNumeric(),
  body('unit').notEmpty().isNumeric()
]

export const updateSchedulingValidation = [
  body('id').notEmpty().isNumeric(),
  body('type').notEmpty().isString(),
  body('schedulingDate').notEmpty().isDate({
    format: 'YYYY-MM-DD',
    strictMode: true
  }),
  body('responsible').notEmpty().isNumeric(),
  body('defunct').notEmpty().isNumeric(),
  body('employee').notEmpty().isNumeric(),
  body('unit').notEmpty().isNumeric()
]

export const deleteSchedulingValidation = [
  param('id').notEmpty().isNumeric()
]