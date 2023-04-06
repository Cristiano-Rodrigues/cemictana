import {
  CreateEmployeeController,
  GetEmployeesController,
  UpdateEmployeeController,
  DeleteEmployeeController
} from '../controllers/management/employee'
import { Connection, EmployeeRepository } from '../repositories'
import { adaptController } from './adapters/express-controller-adapter'

export default router => {
  const params = [
    Connection,
    EmployeeRepository
  ]
  
  const createEmployeeController = new CreateEmployeeController(...params)
  const getEmployeesController = new GetEmployeesController(...params)
  const updateEmployeeController = new UpdateEmployeeController(...params)
  const deleteEmployeeController = new DeleteEmployeeController(...params)

  router.post('/employee', adaptController(createEmployeeController))
  router.get('/employee', adaptController(getEmployeesController))
  router.put('/employee', adaptController(updateEmployeeController))
  router.delete('/employee/:id', adaptController(deleteEmployeeController))

  return router
}