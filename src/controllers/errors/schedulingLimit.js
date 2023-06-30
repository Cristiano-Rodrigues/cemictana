export class SchedulingLimit extends Error {
  constructor () {
    super()
    this.name = 'SchedulingLimit'
  }
}