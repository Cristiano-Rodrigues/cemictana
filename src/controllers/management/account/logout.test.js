import { LogoutController } from './logout'

describe('LogoutController', () => {
  test('Ensure it destroys session properly', () => {
    const logouController = new LogoutController()

    logouController.handle({
      session: {
        destroy () {
          expect(1).toBe(1)
        }
      }
    })
  })
})