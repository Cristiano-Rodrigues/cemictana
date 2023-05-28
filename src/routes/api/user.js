import {
  CreateUserController,
  GetUsersController,
  UpdateUserController,
  DeleteUserController
} from '../../controllers/management/user'
import {
  createUserValidation,
  deleteUserValidation,
  updateUserValidation
} from './validations/expressValidator'
import { Validation } from '../../middlewares/validation'
import { Connection, UserRepository } from '../../repositories'
import { adaptController, adaptMiddleware, Hasher, JWTHandler, Mailer, Validator } from './adapters'
import { JWTAuthentication } from '../../middlewares/jwtAuth'

export default router => {
  const params = [
    Connection,
    UserRepository,
    Hasher,
    Mailer
  ]
  
  const createUserController = new CreateUserController(...params)
  const getUsersController = new GetUsersController(...params)
  const updateUserController = new UpdateUserController(...params)
  const deleteUserController = new DeleteUserController(...params)

  const tokenAuth = new JWTAuthentication(JWTHandler)

  const createUserValidator = new Validation(Validator, createUserValidation)
  const updateUserValidator = new Validation(Validator, updateUserValidation)
  const deleteUserValidator = new Validation(Validator, deleteUserValidation)

  router.post(
    '/user',
    adaptMiddleware(tokenAuth),
    adaptMiddleware(createUserValidator),
    adaptController(createUserController)
  )

  router.get(
    '/user',
    adaptMiddleware(tokenAuth),
    adaptController(getUsersController)
  )

  router.put(
    '/user',
    adaptMiddleware(tokenAuth),
    adaptMiddleware(updateUserValidator),
    adaptController(updateUserController)
  )

  router.delete(
    '/user/:id',
    adaptMiddleware(tokenAuth),
    adaptMiddleware(deleteUserValidator),
    adaptController(deleteUserController)
  )

  return router
}