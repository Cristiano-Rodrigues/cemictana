import {
  CreateEmployeeController,
  GetEmployeesController,
  UpdateEmployeeController,
  DeleteEmployeeController
} from '../../controllers/management/employee'
import {
  createEmployeeValidation,
  deleteEmployeeValidation,
  updateEmployeeValidation
} from './validations/expressValidator'
import { JWTAuthentication, Validation } from '../../middlewares'
import { Connection, EmployeeRepository } from '../../repositories'
import { adaptController, adaptMiddleware, JWTHandler, Validator } from './adapters'

export default router => {
  const params = [
    Connection,
    EmployeeRepository
  ]
  
  const createEmployeeController = new CreateEmployeeController(...params)
  const getEmployeesController = new GetEmployeesController(...params)
  const updateEmployeeController = new UpdateEmployeeController(...params)
  const deleteEmployeeController = new DeleteEmployeeController(...params)

  const isAdminOrEmployee = new JWTAuthentication(JWTHandler, ['admin', 'funcionário'])
  const isAdmin = new JWTAuthentication(JWTHandler, ['admin'])

  const createEmployeeValidator = new Validation(Validator, createEmployeeValidation)
  const updateEmployeeValidator = new Validation(Validator, updateEmployeeValidation)
  const deleteEmployeeValidator = new Validation(Validator, deleteEmployeeValidation)

  router.post(
    '/employee',
    adaptMiddleware(isAdmin),
    adaptMiddleware(createEmployeeValidator),
    adaptController(createEmployeeController)
  )
  
  router.get(
    '/employee',
    adaptMiddleware(isAdminOrEmployee),
    adaptController(getEmployeesController)
  )

  router.put(
    '/employee',
    adaptMiddleware(isAdmin),
    adaptMiddleware(updateEmployeeValidator),
    adaptController(updateEmployeeController)
  )

  router.delete(
    '/employee/:id',
    adaptMiddleware(isAdmin),
    adaptMiddleware(deleteEmployeeValidator),
    adaptController(deleteEmployeeController)
  )

  return router
}