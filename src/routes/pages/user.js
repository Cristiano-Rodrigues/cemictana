import { adaptController } from './adapters/express/controllerAdapter'

const partialRoutes = [
  '/',
  '/defunct',
]

const registerRoute = (router, route) => {
  router.get(
    route,
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