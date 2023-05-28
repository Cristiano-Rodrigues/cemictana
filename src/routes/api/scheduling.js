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

  const tokenAuth = new JWTAuthentication(JWTHandler)

  const createSchedulingValidator = new Validation(Validator, createSchedulingValidation)
  const updateSchedulingValidator = new Validation(Validator, updateSchedulingValidation)
  const deleteSchedulingValidator = new Validation(Validator, deleteSchedulingValidation)

  router.post(
    '/scheduling',
    adaptMiddleware(tokenAuth),
    adaptMiddleware(createSchedulingValidator),
    adaptController(createSchedulingController)
  )

  router.get(
    '/scheduling',
    adaptMiddleware(tokenAuth),
    adaptController(getSchedulingsController)
  )

  router.put(
    '/scheduling',
    adaptMiddleware(tokenAuth),
    adaptMiddleware(updateSchedulingValidator),
    adaptController(updateSchedulingController)
  )

  router.delete(
    '/scheduling/:id',
    adaptMiddleware(tokenAuth),
    adaptMiddleware(deleteSchedulingValidator),
    adaptController(deleteSchedulingController)
  )

  return router
}