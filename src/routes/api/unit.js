import {
  CreateUnitController,
  GetUnitsController,
  UpdateUnitController,
  DeleteUnitController
} from '../../controllers/management/unit/'
import {
  createUnitValidation,
  deleteUnitValidation,
  updateUnitValidation
} from './validations/expressValidator'
import { Validation } from '../../middlewares/validation'
import { Connection, UnitRepository } from '../../repositories'
import { adaptController, adaptMiddleware, JWTHandler, Validator } from './adapters'
import { JWTAuthentication } from '../../middlewares/jwtAuth'

export default router => {
  const params = [
    Connection,
    UnitRepository
  ]

  const createUnitController = new CreateUnitController(...params)
  const getUnitsController = new GetUnitsController(...params)
  const updateUnitController = new UpdateUnitController(...params)
  const deleteUnitController = new DeleteUnitController(...params)

  const isAuth = new JWTAuthentication(JWTHandler, ['admin', 'funcionário', 'padrão'])
  const isAdminOrEmployee = new JWTAuthentication(JWTHandler, ['admin', 'funcionário'])
  const isAdmin = new JWTAuthentication(JWTHandler, ['admin'])

  const createUnitValidator = new Validation(Validator, createUnitValidation)
  const updateUnitValidator = new Validation(Validator, updateUnitValidation)
  const deleteUnitValidator = new Validation(Validator, deleteUnitValidation)

  router.post(
    '/unit',
    adaptMiddleware(isAdminOrEmployee),
    adaptMiddleware(createUnitValidator),
    adaptController(createUnitController)
  )

  router.get(
    '/unit',
    adaptMiddleware(isAuth),
    adaptController(getUnitsController)
  )

  router.put(
    '/unit',
    adaptMiddleware(isAdminOrEmployee),
    adaptMiddleware(updateUnitValidator),
    adaptController(updateUnitController)
  )

  router.delete(
    '/unit/:id',
    adaptMiddleware(isAdmin),
    adaptMiddleware(deleteUnitValidator),
    adaptController(deleteUnitController)
  )

  return router
}