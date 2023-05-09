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
import { JWTAuthentication, Validation } from '../middlewares'
import { Connection, DefunctRepository } from '../repositories'
import { adaptController, adaptMiddleware, JWTHandler, Validator } from './adapters'

export default router => {
  const params = [
    Connection,
    DefunctRepository
  ]

  const createDefunctController = new CreateDefunctController(...params)
  const getDefunctsController = new GetDefunctsController(...params)
  const updateDefunctController = new UpdateDefunctController(...params)
  const deleteDefunctController = new DeleteDefunctController(...params)

  const tokenAuth = new JWTAuthentication(JWTHandler)

  const createDefunctValidator = new Validation(Validator, createDefunctValidation)
  const updateDefunctValidator = new Validation(Validator, updateDefunctValidation)
  const deleteDefunctValidator = new Validation(Validator, deleteDefunctValidation)

  router.post(
    '/defunct',
    adaptMiddleware(tokenAuth),
    adaptMiddleware(createDefunctValidator),
    adaptController(createDefunctController)
  )

  router.get(
    '/defunct',
    adaptMiddleware(tokenAuth),
    adaptController(getDefunctsController)
  )

  router.put(
    '/defunct',
    adaptMiddleware(tokenAuth),
    adaptMiddleware(updateDefunctValidator),
    adaptController(updateDefunctController)
  )

  router.delete(
    '/defunct/:id',
    adaptMiddleware(tokenAuth),
    adaptMiddleware(deleteDefunctValidator),
    adaptController(deleteDefunctController)
  )

  return router
}