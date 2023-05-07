import {
  CreateSchedulingController,
  GetSchedulingsController,
  UpdateSchedulingController,
  DeleteSchedulingController
} from '../controllers/management/scheduling'
import { Validation } from '../middlewares/validation'
import {
  createSchedulingValidation,
  deleteSchedulingValidation,
  updateSchedulingValidation
} from './validations/expressValidator'
import {
  Connection,
  DefunctRepository,
  EmployeeRepository,
  ResponsibleRepository,
  SchedulingRepository,
  UnitRepository
} from '../repositories'
import { adaptController, adaptMiddleware, Validator } from './adapters'

export default router => {
  const params = [
    Connection,
    SchedulingRepository,
    ResponsibleRepository,
    DefunctRepository,
    UnitRepository,
    EmployeeRepository
  ]
  
  const createSchedulingController = new CreateSchedulingController(...params)
  const getSchedulingsController = new GetSchedulingsController(...params)
  const updateSchedulingController = new UpdateSchedulingController(...params)
  const deleteSchedulingController = new DeleteSchedulingController(...params)

  const createSchedulingValidator = new Validation(Validator, createSchedulingValidation)
  const updateSchedulingValidator = new Validation(Validator, updateSchedulingValidation)
  const deleteSchedulingValidator = new Validation(Validator, deleteSchedulingValidation)

  router.post(
    '/scheduling',
    adaptMiddleware(createSchedulingValidator),
    adaptController(createSchedulingController)
  )

  router.get('/scheduling', adaptController(getSchedulingsController))

  router.put(
    '/scheduling',
    adaptMiddleware(updateSchedulingValidator),
    adaptController(updateSchedulingController)
  )

  router.delete(
    '/scheduling/:id',
    adaptMiddleware(deleteSchedulingValidator),
    adaptController(deleteSchedulingController)
  )

  return router
}