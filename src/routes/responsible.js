import {
  CreateResponsibleController,
  GetResponsiblesController,
  UpdateResponsibleController,
  DeleteResponsibleController
} from '../controllers/management/responsible'
import {
  createResponsibleValidation,
  deleteResponsibleValidation,
  updateResponsibleValidation
} from './validations/expressValidator'
import { Validation } from '../middlewares'
import { Connection, ResponsibleRepository } from '../repositories'
import { adaptController, adaptMiddleware, Validator } from './adapters'

export default router => {
  const params = [
    Connection,
    ResponsibleRepository
  ]

  const createResponsibleController = new CreateResponsibleController(...params)
  const getResponsiblesController = new GetResponsiblesController(...params)
  const updateResponsibleController = new UpdateResponsibleController(...params)
  const deleteResponsibleController = new DeleteResponsibleController(...params)

  const createResponsibleValidator = new Validation(Validator, createResponsibleValidation)
  const updateResponsibleValidator = new Validation(Validator, updateResponsibleValidation)
  const deleteResponsibleValidator = new Validation(Validator, deleteResponsibleValidation)

  router.post(
    '/responsible',
    adaptMiddleware(createResponsibleValidator),
    adaptController(createResponsibleController)
  )

  router.get('/responsible', adaptController(getResponsiblesController))

  router.put(
    '/responsible',
    adaptMiddleware(updateResponsibleValidator),
    adaptController(updateResponsibleController)
  )

  router.delete(
    '/responsible/:id',
    adaptMiddleware(deleteResponsibleValidator),
    adaptController(deleteResponsibleController)
  )

  return router
}