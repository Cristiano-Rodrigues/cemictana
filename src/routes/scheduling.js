import {
  CreateSchedulingController,
  GetSchedulingsController,
  UpdateSchedulingController,
  DeleteSchedulingController
} from '../controllers/management/scheduling'
import { Connection, DefunctRepository, EmployeeRepository, ResponsibleRepository, SchedulingRepository, UnitRepository } from '../repositories'
import { adaptController } from './adapters'

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

  router.post('/scheduling', adaptController(createSchedulingController))
  router.get('/scheduling', adaptController(getSchedulingsController))
  router.put('/scheduling', adaptController(updateSchedulingController))
  router.delete('/scheduling/:id', adaptController(deleteSchedulingController))

  return router
}