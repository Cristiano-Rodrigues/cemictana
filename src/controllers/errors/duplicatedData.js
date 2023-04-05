export class DuplicatedData extends Error {
  constructor (fieldName) {
    super(`Duplicated entry ${fieldName}`)
    this.name = 'DuplicatedData'
  }
}