import { InvalidEntry, ServerError } from '../../errors/'

export class DeleteResponsibleController {
  constructor (
    Connection,
    ResponsibleRepository
  ) {
    this.conn = new Connection()
    this.responsibleRepository = new ResponsibleRepository(this.conn)
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