import {
  CreateDefunctController,
  GetDefunctsController,
  UpdateDefunctController,
  DeleteDefunctController
} from '../controllers/management/defunct'
import {
  createDefunctValidation,
  deleteDefunctValidation,
  updateDefunctValidation
} from './validations/expressValidator'
import { Validation } from '../middlewares'
import { Connection, DefunctRepository } from '../repositories'
import { adaptController, adaptMiddleware, Validator } from './adapters'

export default router => {
  const params = [
    Connection,
    DefunctRepository
  ]

  const createDefunctController = new CreateDefunctController(...params)
  const getDefunctsController = new GetDefunctsController(...params)
  const updateDefunctController = new UpdateDefunctController(...params)
  const deleteDefunctController = new DeleteDefunctController(...params)

  const createDefunctValidator = new Validation(Validator, createDefunctValidation)
  const updateDefunctValidator = new Validation(Validator, updateDefunctValidation)
  const deleteDefunctValidator = new Validation(Validator, deleteDefunctValidation)

  router.post(
    '/defunct',
    adaptMiddleware(createDefunctValidator),
    adaptController(createDefunctController)
  )

  router.get('/defunct', adaptController(getDefunctsController))

  router.put(
    '/defunct',
    adaptMiddleware(updateDefunctValidator),
    adaptController(updateDefunctController)
  )

  router.delete(
    '/defunct/:id',
    adaptMiddleware(deleteDefunctValidator),
    adaptController(deleteDefunctController)
  )

  return router
}