export function adaptMiddleware (middleware) {
  return async (req, res, next) => {
    const { code, error, success } = await middleware.handle(req)

    if (success) {
      return next()
    }

    if (error) {
      res.status(code).send({ error })
    }
  }
}