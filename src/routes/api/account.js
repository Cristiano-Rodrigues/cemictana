import { LoginController, SignUpController } from '../../controllers/management/account'
import { loginValidation, signUpValidation } from './validations/expressValidator'
import { Validation } from '../../middlewares/validation'
import {
  Connection, 
  ResponsibleRepository,
  UserRepository
} from '../../repositories'
import { adaptController, adaptMiddleware, Hasher, JWTHandler, Mailer, Validator } from './adapters'

export default router => {
  const signUpController = new SignUpController(
    Connection,
    UserRepository,
    ResponsibleRepository,
    Hasher,
    Mailer
  )
  const loginController = new LoginController(
    Connection,
    UserRepository,
    Hasher,
    JWTHandler
  )

  const signUpValidator = new Validation(Validator, signUpValidation)
  const loginValidator = new Validation(Validator, loginValidation)

  router.post(
    '/signup',
    adaptMiddleware(signUpValidator),
    adaptController(signUpController)
  )

  router.post(
    '/login',
    adaptMiddleware(loginValidator),
    adaptController(loginController)
  )

  return router
}