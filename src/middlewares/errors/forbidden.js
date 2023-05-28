export class Forbidden extends Error {
  constructor () {
    super('Forbidden Access to requested resource')
    this.name = 'Forbidden'
  }
}
