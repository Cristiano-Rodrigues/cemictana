import { adaptController } from './adapters'

export default router => {
  router.get('/', adaptController({
    async handle (_) {
      return {
        code: 200,
        version: '1.0.0',
        name: 'cemictana-api'
      }
    }
  }))

  return router
}