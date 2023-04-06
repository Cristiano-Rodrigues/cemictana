import { DuplicatedData, InvalidEntry, ServerError } from '../../errors/'

export class UpdateResponsibleController {
  constructor (
    Connection,
    ResponsibleRepository
  ) {
    this.conn = new Connection()
    this.responsibleRepository = new ResponsibleRepository(this.conn)
  }

  async handle (req) {
    const {
      id,
      name,
      identification,
      bornDate,
      address
    } = req.body

    const anyNullValue = [id, name, identification].some(field => field == null)

    if ( anyNullValue ) {
      return {
        code: 400,
        error: new InvalidEntry('id, name, or identification')
      }
    }

    if ( bornDate ) {
      const date = new Date(bornDate)
      if (Date.now() < date.getTime()) {
        return {
          code: 400,
          error: new InvalidEntry('bornDate')
        }
      }
    }

    try {
      const responsible = await this.responsibleRepository.getByIdentification(identification)
      const alreadyExists = !!responsible && responsible.id != id

      if ( alreadyExists ) {
        return {
          code: 400,
          error: new DuplicatedData('identification')
        }
      }

      const newResponsible = Object.assign({}, responsible, {
        name,
        identification,
        bornDate,
        address
      })

      await this.responsibleRepository.update(id, newResponsible)

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