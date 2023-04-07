import { DuplicatedData, InvalidEntry, ServerError } from '../../errors/'

export class UpdateUnitController {
  constructor (
    Connection,
    UnitRepository
  ) {
    this.Connection = Connection
    this.UnitRepository = UnitRepository
  }

  async handle (req) {
    const {
      id,
      type,
      location,
      state
    } = req.body

    const anyNullValue = [id, type, location, state].some(field => field == null)

    if ( anyNullValue ) {
      return {
        code: 400,
        error: new InvalidEntry('id, type, location or state')
      }
    }

    try {
      const conn = new this.Connection()
      const unitRepository = new this.UnitRepository(conn)
      
      const unit = await unitRepository.getByLocation(location)
      const alreadyExists = !!unit && unit.id != id

      if ( alreadyExists ) {
        return {
          code: 400,
          error: new DuplicatedData('location')
        }
      }

      const newUnit = Object.assign({}, unit, {
        type,
        location,
        state
      })

      await unitRepository.update(id, newUnit)

      conn.close()
    } catch (error) {
      return {
        code: 500,
        error: new ServerError()
      }
    }

    return {
      code: 200,
      success: true
    }
  }
}