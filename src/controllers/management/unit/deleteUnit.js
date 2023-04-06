import { InvalidEntry, ServerError } from '../../errors/'

export class DeleteUnitController {
  constructor (
    Connection,
    UnitRepository
  ) {
    this.conn = new Connection()
    this.unitRepository = new UnitRepository(this.conn)
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