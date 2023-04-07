import {
  CreateDefunctController,
  GetDefunctsController,
  UpdateDefunctController,
  DeleteDefunctController
} from '../controllers/management/defunct'
import { Connection, DefunctRepository } from '../repositories'
import { adaptController } from './adapters'

export default router => {
  const params = [
    Connection,
    DefunctRepository
  ]

  const createDefunctController = new CreateDefunctController(...params)
  const getDefunctsController = new GetDefunctsController(...params)
  const updateDefunctController = new UpdateDefunctController(...params)
  const deleteDefunctController = new DeleteDefunctController(...params)

  router.post('/defunct', adaptController(createDefunctController))
  router.get('/defunct', adaptController(getDefunctsController))
  router.put('/defunct', adaptController(updateDefunctController))
  router.delete('/defunct/:id', adaptController(deleteDefunctController))

  return router
}