import { SessionAuthentication } from '../../middlewares/'
import { adaptMiddleware } from '../api/adapters/'
import { adaptController } from './adapters'

const partialRoutes = [
  '/',
  '/defunct',
  '/employee',
  '/responsible',
  '/unit',
  '/user'
]

const registerRoute = (router, route) => {
  router.get(
    route,
    adaptMiddleware(new SessionAuthentication(['admin', 'funcionário'])),
    adaptController(async req => {
      return {
        pageSrc: route.slice(1),
        data: {}
      }
    })
  )
}

export default router => {
  
  for (const partialRoute of partialRoutes) {
    const route = '/admin' + partialRoute

    registerRoute(router, route)
  }

  return router
}