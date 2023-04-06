import { DuplicatedData, InvalidEntry, ServerError } from '../../errors/'

export class CreateUnitController {
  constructor (
    Connection,
    UnitRepository
  ) {
    this.Connection = Connection
    this.UnitRepository = UnitRepository
  }

  async handle (req) {
    const { type, location, state } = req.body

    const anyNullValue = [type, location].some(field => field == null)

    if ( anyNullValue ) {
      return {
        code: 400,
        error: new InvalidEntry('type or location')
      }
    }

    try {
      this.conn = new this.Connection()
      this.unitRepository = new this.UnitRepository(this.conn)

      const alreadyExists = await this.unitRepository.getByLocation(location)

      if ( alreadyExists ) {
        return {
          code: 400,
          error: new DuplicatedData('location')
        }
      }

      await this.unitRepository.create({ type, location, state })

      this.conn.close()
    } catch (error) {
      return {
        code: 500,
        error: new ServerError()
      }
    }

    return {
      code: 201,
      success: true
    }
  }
}