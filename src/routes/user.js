import {
  CreateUserController,
  GetUsersController,
  UpdateUserController,
  DeleteUserController
} from '../controllers/management/user'
import { Connection, UserRepository } from '../repositories'
import { adaptController, Hasher, Mailer } from './adapters'

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

  router.post('/user', adaptController(createUserController))
  router.get('/user', adaptController(getUsersController))
  router.put('/user', adaptController(updateUserController))
  router.delete('/user/:id', adaptController(deleteUserController))

  return router
}