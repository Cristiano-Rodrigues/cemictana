import {
  CreateSchedulingController,
  GetSchedulingsController,
  UpdateSchedulingController,
  DeleteSchedulingController
} from '../../controllers/management/scheduling'
import { Validation } from '../../middlewares/validation'
import {
  createSchedulingValidation,
  deleteSchedulingValidation,
  updateSchedulingValidation
} from './validations/expressValidator'
import {
  Connection,
  DefunctRepository,
  EmployeeRepository,
  SchedulingRepository,
  UnitRepository
} from '../../repositories'
import { adaptController, adaptMiddleware, JWTHandler, Validator } from './adapters'
import { JWTAuthentication } from '../../middlewares/jwtAuth'

export default router => {
  const params = [
    Connection,
    SchedulingRepository,
    DefunctRepository,
    UnitRepository,
    EmployeeRepository
  ]
  
  const createSchedulingController = new CreateSchedulingController(...params)
  const getSchedulingsController = new GetSchedulingsController(...params)
  const updateSchedulingController = new UpdateSchedulingController(...params)
  const deleteSchedulingController = new DeleteSchedulingController(...params)

  const isAuth = new JWTAuthentication(JWTHandler, ['admin', 'funcionário', 'padrão'])

  const createSchedulingValidator = new Validation(Validator, createSchedulingValidation)
  const updateSchedulingValidator = new Validation(Validator, updateSchedulingValidation)
  const deleteSchedulingValidator = new Validation(Validator, deleteSchedulingValidation)

  router.post(
    '/scheduling',
    adaptMiddleware(isAuth),
    adaptMiddleware(createSchedulingValidator),
    adaptController(createSchedulingController)
  )

  router.get(
    '/scheduling',
    adaptMiddleware(isAuth),
    adaptController(getSchedulingsController)
  )

  router.put(
    '/scheduling',
    adaptMiddleware(isAuth),
    adaptMiddleware(updateSchedulingValidator),
    adaptController(updateSchedulingController)
  )

  router.delete(
    '/scheduling/:id',
    adaptMiddleware(isAuth),
    adaptMiddleware(deleteSchedulingValidator),
    adaptController(deleteSchedulingController)
  )

  return router
}