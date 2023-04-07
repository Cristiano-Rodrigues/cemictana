export function generateRandomCode ({ min, max }) {
  const diff = max - min
  const random = min + Math.floor(Math.random() * diff)
  return random
}