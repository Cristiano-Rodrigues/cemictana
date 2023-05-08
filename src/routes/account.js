import { LoginController } from '../controllers/management/account'
import { loginValidation } from './validations/expressValidator'
import { Validation } from '../middlewares/validation'
import { Connection, UserRepository } from '../repositories'
import { adaptController, adaptMiddleware, Hasher, JWTHandler, Validator } from './adapters'

export default router => {
  const loginController = new LoginController(
    Connection,
    UserRepository,
    Hasher,
    JWTHandler
  )

  const loginValidator = new Validation(Validator, loginValidation)

  router.post(
    '/login',
    adaptMiddleware(loginValidator),
    adaptController(loginController)
  )

  return router
}