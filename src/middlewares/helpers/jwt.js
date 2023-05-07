export function getToken (req) {
  const token = req.body.token || req.header('x-access-token') || req.query.token
  return token
}
