import {
  CreateUnitController,
  GetUnitsController,
  UpdateUnitController,
  DeleteUnitController
} from '../controllers/management/unit/'
import { Connection, UnitRepository } from '../repositories'
import { adaptController } from './adapters'

export default router => {
  const params = [
    Connection,
    UnitRepository
  ]

  const createUnitController = new CreateUnitController(...params)
  const getUnitsController = new GetUnitsController(...params)
  const updateUnitController = new UpdateUnitController(...params)
  const deleteUnitController = new DeleteUnitController(...params)

  router.post('/unit', adaptController(createUnitController))
  router.get('/unit', adaptController(getUnitsController))
  router.put('/unit', adaptController(updateUnitController))
  router.delete('/unit/:id', adaptController(deleteUnitController))

  return router
}