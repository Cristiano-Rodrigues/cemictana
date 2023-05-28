const error = {
  code: 400,
  message: 'Not found'
}

export function adaptController(controller) {
  return async (req, res) => {
    const { pageSrc, data } = await controller(req)
    res.render(pageSrc, data, (err, file) => {
      if (err) {
        console.log(err)
        return res.status(error.code).send(error.message)
      }
      res.send(file)
    })
  }
}