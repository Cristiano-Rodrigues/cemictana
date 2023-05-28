import { adaptController } from './adapters/express/controllerAdapter'

const routes = [
  '/',
  '/login',
  '/signup',
]

const registerRoute = (router, route) => {
  router.get(
    route,
    adaptController(async req => {
      return {
        pageSrc: route.slice(1),
        data: {
          user: req.session.user
        }
      }
    })
  )
}

export default router => {
  
  for (const route of routes) {
    registerRoute(router, route)
  }

  return router
}