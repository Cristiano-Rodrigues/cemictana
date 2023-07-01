import { InvalidEntry } from '../../errors/'

export class UploadDocImagesController {
  constructor (
    Connection,
    DefunctRepository,
  ) {
    this.Connection = Connection
    this.DefunctRepository = DefunctRepository
  }

  async handle (req) {
    const { filenames } = req
    const id = req.query.id

    if (!filenames || !(typeof filenames == 'object')) {
      return {
        code: 400,
        error: new InvalidEntry('filenames')
      }
    }

    try {
      const conn = new this.Connection()

      const defunctRepository = new this.DefunctRepository(conn)
      const defunct = await defunctRepository.getById(id)

      if (!defunct) {
        return {
          code: 400,
          error: new InvalidEntry('defunct')
        }
      }

      const newDefunct = Object.assign({}, defunct, {
        imageUrl: filenames[0],
        identificationFileUrl: filenames[1]
      })

      await defunctRepository.update(id, newDefunct)

      conn.close()
    } catch (error) {
      return {
        code: 500,
        error
      }
    }

    return {
      code: 200,
      success: true
    }
  }
}