export class InvalidEntry extends Error {
  constructor (fieldName) {
    super(`Invalid entry ${fieldName}`)
    this.name = 'InvalidEntry'
  }
}