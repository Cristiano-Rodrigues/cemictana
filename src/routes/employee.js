import {
  CreateEmployeeController,
  GetEmployeesController,
  UpdateEmployeeController,
  DeleteEmployeeController
} from '../controllers/management/employee'
import { Validation } from '../middlewares'
import { Connection, EmployeeRepository } from '../repositories'
import { adaptController, adaptMiddleware, Validator } from './adapters'
import { createEmployeeValidation, deleteEmployeeValidation, updateEmployeeValidation } from './validations/expressValidator'

export default router => {
  const params = [
    Connection,
    EmployeeRepository
  ]
  
  const createEmployeeController = new CreateEmployeeController(...params)
  const getEmployeesController = new GetEmployeesController(...params)
  const updateEmployeeController = new UpdateEmployeeController(...params)
  const deleteEmployeeController = new DeleteEmployeeController(...params)

  const createEmployeeValidator = new Validation(Validator, createEmployeeValidation)
  const updateEmployeeValidator = new Validation(Validator, updateEmployeeValidation)
  const deleteEmployeeValidator = new Validation(Validator, deleteEmployeeValidation)

  router.post(
    '/employee',
    adaptMiddleware(createEmployeeValidator),
    adaptController(createEmployeeController)
  )
  
  router.get('/employee', adaptController(getEmployeesController))

  router.put(
    '/employee',
    adaptMiddleware(updateEmployeeValidator),
    adaptController(updateEmployeeController)
  )

  router.delete(
    '/employee/:id',
    adaptMiddleware(deleteEmployeeValidator),
    adaptController(deleteEmployeeController)
  )

  return router
}