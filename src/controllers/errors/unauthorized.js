export class Unauthorized extends Error {
  constructor (field) {
    super(`Incorrect credential ${field}`)
    this.name = 'Unauthorized'
  }
}
