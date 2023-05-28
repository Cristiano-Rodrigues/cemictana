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

  const tokenAuth = new JWTAuthentication(JWTHandler)

  const updateResponsibleValidator = new Validation(Validator, updateResponsibleValidation)

  router.get(
    '/responsible',
    adaptMiddleware(tokenAuth),
    adaptController(getResponsiblesController)
  )

  router.put(
    '/responsible',
    adaptMiddleware(tokenAuth),
    adaptMiddleware(updateResponsibleValidator),
    adaptController(updateResponsibleController)
  )

  return router
}