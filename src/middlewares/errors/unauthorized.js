export class Unauthorized extends Error {
  constructor () {
    super('Incorrect credentials')
    this.name = 'Unauthorized'
  }
}
