import { SessionAuthentication } from '../../middlewares'
import { adaptMiddleware } from '../api/adapters'
import { adaptController } from './adapters/express/controllerAdapter'

const partialRoutes = [
  '/',
  '/defunct',
]

const registerRoute = (router, route) => {
  router.get(
    route,
    adaptMiddleware(new SessionAuthentication(['padrão'])),
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
    const route = '/user' + partialRoute

    registerRoute(router, route)
  }

  return router
}