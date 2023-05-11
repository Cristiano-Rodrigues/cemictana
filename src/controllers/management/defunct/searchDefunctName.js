import { ServerError } from '../../errors'

export class SearchDefunctNameController {
  constructor (
    Connection,
    DefunctRepository
  ) {
    this.Connection = Connection
    this.DefunctRepository = DefunctRepository
  }

  async handle (req) {
    const search = req.params.search ?? ''

    try {
      const conn = new this.Connection()
      const defunctRepository = new this.DefunctRepository(conn)
      
      const result = await defunctRepository.searchByName(search)

      conn.close()

      return {
        code: 200,
        success: true,
        result
      }
    } catch (error) {
      return {
        code: 500,
        error: new ServerError()
      }
    }
  }
}