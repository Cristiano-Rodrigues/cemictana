export class LogoutController {

  async handle (req) {
    if (req.session && req.session.destroy) {
      req.session.destroy()
    }
  }

}