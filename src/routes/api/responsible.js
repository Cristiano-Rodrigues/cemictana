import {
  GetResponsiblesController,
  UpdateResponsibleController
} from '../../controllers/management/responsible'
import { updateResponsibleValidation } from './validations/expressValidator'
import { JWTAuthentication, Validation } from '../../middlewares'
import { Connection, ResponsibleRepository } from '../../repositories'
import { adaptController, adaptMiddleware, JWTHandler, Validator } from './adapters'

export default router => {
  const params = [
    Connection,
    ResponsibleRepository
  ]

  const getResponsiblesController = new GetResponsiblesController(...params)
  const updateResponsibleController = new UpdateResponsibleController(...params)

  const isAuth = new JWTAuthentication(JWTHandler, ['admin', 'funcionário', 'padrão'])
  const isAdminOrEmployee = new JWTAuthentication(JWTHandler, ['admin', 'funcionário'])

  const updateResponsibleValidator = new Validation(Validator, updateResponsibleValidation)

  router.get(
    '/responsible',
    adaptMiddleware(isAuth),
    adaptController(getResponsiblesController)
  )

  router.put(
    '/responsible',
    adaptMiddleware(isAdminOrEmployee),
    adaptMiddleware(updateResponsibleValidator),
    adaptController(updateResponsibleController)
  )

  return router
}