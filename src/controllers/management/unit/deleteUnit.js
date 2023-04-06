import { InvalidEntry, ServerError } from '../../errors/'

export class DeleteUnitController {
  constructor (
    Connection,
    UnitRepository
  ) {
    this.Connection = Connection
    this.UnitRepository = UnitRepository
  }

  async handle (req) {
    const id = req.params?.id

    if ( !id ) {
      return {
        code: 400,
        error: new InvalidEntry('id')
      }
    }

    try {
      this.conn = new this.Connection()
      this.unitRepository = new this.UnitRepository(this.conn)
      
      await this.unitRepository.delete(id)

      this.conn.close()
    } catch (error) {
      return {
        code: 500,
        error: new ServerError()
      }
    }

    return {
      code: 204,
      success: true
    }
  }
}