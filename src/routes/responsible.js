import {
  CreateResponsibleController,
  GetResponsiblesController,
  UpdateResponsibleController,
  DeleteResponsibleController
} from '../controllers/management/responsible'
import { Connection, ResponsibleRepository } from '../repositories'
import { adaptController } from './adapters'

export default router => {
  const params = [
    Connection,
    ResponsibleRepository
  ]

  const createResponsibleController = new CreateResponsibleController(...params)
  const getResponsiblesController = new GetResponsiblesController(...params)
  const updateResponsibleController = new UpdateResponsibleController(...params)
  const deleteResponsibleController = new DeleteResponsibleController(...params)

  router.post('/responsible', adaptController(createResponsibleController))
  router.get('/responsible', adaptController(getResponsiblesController))
  router.put('/responsible', adaptController(updateResponsibleController))
  router.delete('/responsible/:id', adaptController(deleteResponsibleController))

  return router
}