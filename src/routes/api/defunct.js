import {
  CreateDefunctController,
  GetDefunctsController,
  GetDefunctsByUserController,
  SearchDefunctNameController,
  UpdateDefunctController,
  DeleteDefunctController,
  UploadDocImagesController
} from '../../controllers/management/defunct'
import {
  createDefunctValidation,
  deleteDefunctValidation,
  searchDefunctNameValidation,
  updateDefunctValidation
} from './validations/expressValidator'
import { ImageUpload, JWTAuthentication, Validation } from '../../middlewares'
import { Connection, DefunctRepository, UserRepository } from '../../repositories'
import { adaptController, adaptMiddleware, JWTHandler, Uploader, Validator } from './adapters'
import { generateRandomCode } from '../../controllers/helpers'

export default router => {
  const params = [
    Connection,
    DefunctRepository,
    UserRepository,
    JWTHandler
  ]

  const createDefunctController = new CreateDefunctController(...params)
  const getDefunctsController = new GetDefunctsController(...params)
  const getDefunctsByUserController = new GetDefunctsByUserController(...params)
  const searchDefunctNameController = new SearchDefunctNameController(...params)
  const updateDefunctController = new UpdateDefunctController(...params)
  const uploadDefunctDocImagesController = new UploadDocImagesController(...params)
  const deleteDefunctController = new DeleteDefunctController(...params)

  const isAuth = new JWTAuthentication(JWTHandler, ['admin', 'funcionário', 'padrão'])
  const isAdminOrEmployee = new JWTAuthentication(JWTHandler, ['admin', 'funcionário'])
  const isAdmin = new JWTAuthentication(JWTHandler, ['admin'])

  const createDefunctValidator = new Validation(Validator, createDefunctValidation)
  const searchDefunctNameValidator = new Validation(Validator, searchDefunctNameValidation)
  const updateDefunctValidator = new Validation(Validator, updateDefunctValidation)
  const deleteDefunctValidator = new Validation(Validator, deleteDefunctValidation)
  const imageUpload = new ImageUpload(() => (
    generateRandomCode({ min: 0, max: 1_000_000 })
  ), Uploader)

  router.post(
    '/defunct',
    adaptMiddleware(isAuth),
    adaptMiddleware(createDefunctValidator),
    adaptController(createDefunctController)
  )

  router.get(
    '/defunct',
    adaptMiddleware(isAuth),
    adaptController(getDefunctsController)
  )

  router.get(
    '/defunct/responsible',
    adaptMiddleware(isAuth),
    adaptController(getDefunctsByUserController)
  )

  router.get(
    '/search/',
    adaptMiddleware(searchDefunctNameValidator),
    adaptController(searchDefunctNameController)
  )

  router.put(
    '/defunct',
    adaptMiddleware(isAdminOrEmployee),
    adaptMiddleware(updateDefunctValidator),
    adaptController(updateDefunctController)
  )

  router.put(
    '/defunct/images',
    // adaptMiddleware(isAuth),
    adaptMiddleware(imageUpload),
    adaptController(uploadDefunctDocImagesController)
  )
  router.delete(
    '/defunct/:id',
    adaptMiddleware(isAdmin),
    adaptMiddleware(deleteDefunctValidator),
    adaptController(deleteDefunctController)
  )

  return router
}