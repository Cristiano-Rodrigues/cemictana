export function adaptController (controller) {
  return async (req, res) => {
    const result = await controller.handle(req)
    const { code, error } = result
    res.status(code)
    if (error) {
      console.error(error)
      return res.send({ error })
    }
    res.send({
      ...result
    })
  }
}