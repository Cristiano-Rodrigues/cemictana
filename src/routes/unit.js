import {
  CreateUnitController,
  GetUnitsController,
  UpdateUnitController,
  DeleteUnitController
} from '../controllers/management/unit/'
import {
  createUnitValidation,
  deleteUnitValidation,
  updateUnitValidation
} from './validations/express-validator'
import { Validation } from '../middlewares/validation'
import { Connection, UnitRepository } from '../repositories'
import { adaptController, adaptMiddleware, Validator } from './adapters'

export default router => {
  const params = [
    Connection,
    UnitRepository
  ]

  const createUnitController = new CreateUnitController(...params)
  const getUnitsController = new GetUnitsController(...params)
  const updateUnitController = new UpdateUnitController(...params)
  const deleteUnitController = new DeleteUnitController(...params)

  const createUnitValidator = new Validation(Validator, createUnitValidation)
  const updateUnitValidator = new Validation(Validator, updateUnitValidation)
  const deleteUnitValidator = new Validation(Validator, deleteUnitValidation)

  router.post(
    '/unit',
    adaptMiddleware(createUnitValidator),
    adaptController(createUnitController)
  )

  router.get('/unit', adaptController(getUnitsController))

  router.put(
    '/unit',
    adaptMiddleware(updateUnitValidator),
    adaptController(updateUnitController)
  )

  router.delete(
    '/unit/:id',
    adaptMiddleware(deleteUnitValidator),
    adaptController(deleteUnitController)
  )

  return router
}