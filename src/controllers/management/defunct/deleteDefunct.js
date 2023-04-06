import { InvalidEntry, ServerError } from '../../errors'

export class DeleteDefunctController {
  constructor (
    Connection,
    DefunctRepository
  ) {
    this.Connection = Connection
    this.DefunctRepository = DefunctRepository
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
      this.responsibleRepository = new this.DefunctRepository(this.conn)
      
      await this.responsibleRepository.delete(id)

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