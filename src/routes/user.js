import {
  CreateUserController,
  GetUsersController,
  UpdateUserController,
  DeleteUserController
} from '../controllers/management/user'
import {
  createUserValidation,
  deleteUserValidation,
  updateUserValidation
} from './validations/expressValidator'
import { Validation } from '../middlewares/validation'
import { Connection, UserRepository } from '../repositories'
import { adaptController, adaptMiddleware, Hasher, Mailer, Validator } from './adapters'

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

  const createUserValidator = new Validation(Validator, createUserValidation)
  const updateUserValidator = new Validation(Validator, updateUserValidation)
  const deleteUserValidator = new Validation(Validator, deleteUserValidation)

  router.post(
    '/user',
    adaptMiddleware(createUserValidator),
    adaptController(createUserController)
  )

  router.get('/user', adaptController(getUsersController))

  router.put(
    '/user',
    adaptMiddleware(updateUserValidator),
    adaptController(updateUserController)
  )

  router.delete(
    '/user/:id',
    adaptMiddleware(deleteUserValidator),
    adaptController(deleteUserController)
  )

  return router
}