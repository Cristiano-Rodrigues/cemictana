import { DuplicatedData, InvalidEntry, ServerError } from '../../errors/'

export class CreateResponsibleController {
  constructor (
    Connection,
    ResponsibleRepository
  ) {
    this.conn = new Connection()
    this.responsibleRepository = new ResponsibleRepository(this.conn)
  }

  async handle (req) {
    const {
      name,
      identification,
      bornDate,
      address
    } = req.body

    const anyNullValue = [name, identification].some(field => field == null)

    if ( anyNullValue ) {
      return {
        code: 400,
        error: new InvalidEntry('name or identification')
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
      const alreadyExists = await this.responsibleRepository.getByIdentification(identification)

      if ( alreadyExists ) {
        return {
          code: 400,
          error: new DuplicatedData('identification')
        }
      }

      await this.responsibleRepository.create({
        name,
        identification,
        bornDate,
        address
      })

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