import { DuplicatedData, InvalidEntry, ServerError } from '../../errors/'

export class UpdateUnitController {
  constructor (
    Connection,
    UnitRepository
  ) {
    this.conn = new Connection()
    this.unitRepository = new UnitRepository(this.conn)
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
      const unit = await this.unitRepository.getByLocation(location)
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

      await this.unitRepository.update(id, newUnit)

      this.conn.close()
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