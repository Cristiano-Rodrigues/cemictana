import { body, param } from 'express-validator'

export const createSchedulingValidation = [
  body('type').notEmpty().isString(),
  body('schedulingDate').isISO8601().toDate(),
  body('defunct').notEmpty().isNumeric(),
  body('unit').notEmpty().isNumeric()
]

export const updateSchedulingValidation = [
  body('id').notEmpty().isNumeric(),
  body('type').notEmpty().isString(),
  body('schedulingDate').isISO8601().toDate(),
  body('defunct').notEmpty().isNumeric(),
  body('employee').notEmpty().isNumeric(),
  body('unit').notEmpty().isNumeric()
]

export const deleteSchedulingValidation = [
  param('id').notEmpty().isNumeric()
]

export const approveSchedulingValidation = [
  body('id').notEmpty().isNumeric()
]