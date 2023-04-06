import { DuplicatedData, InvalidEntry, ServerError } from '../../errors/'
import { CreateResponsibleController } from './createResponsible'

const ConnectionStub = class {
  close () {}
}
const ResponsibleRepositoryStub = class {
  async getByIdentification () {
    return null
  }
  async create () {}
}

const createResponsibleController = new CreateResponsibleController(
  ConnectionStub,
  ResponsibleRepositoryStub
)

const tomorrow = () => {
  const d = new Date()
  const datestring = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() + 1}`
  return datestring
}

describe('CreateResponsibleController', () => {
  test('Should return an error object if null is given for any required value', async () => {
    const result = await createResponsibleController.handle({
      body: {
        name: null,
        identification: 'any_identification',
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof InvalidEntry)).toBe(true)
  })

  test('Should return an error object if given bornDate is after current date', async () => {
    const result = await createResponsibleController.handle({
      body: {
        name: 'any_name',
        identification: 'any_identification',
        bornDate: tomorrow()
      }
    })
    expect(result).toEqual({
      code: 400,
      error: new InvalidEntry('bornDate')
    })
  })

  test('Should return an error object if responsible already exists', async () => {
    const ResponsibleRepositoryStub = class {
      getByIdentification (identification) {
        return {
          identification
        }
      }
    }
    const createResponsibleController = new CreateResponsibleController(
      ConnectionStub,
      ResponsibleRepositoryStub
    )

    const result = await createResponsibleController.handle({
      body: {
        name: 'any_name',
        identification: 'any_identification',
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof DuplicatedData)).toBe(true)
  })

  test('Should return an error object if any internal server error', async () => {
    const ResponsibleRepositoryStub = class {
      getByIdentification (_) {
        throw new Error('any_error')
      }
    }
    const createResponsibleController = new CreateResponsibleController(
      ConnectionStub,
      ResponsibleRepositoryStub
    )

    const result = await createResponsibleController.handle({
      body: {
        name: 'any_name',
        identification: 'any_identification',
      }
    })
    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return a success object if no error', async () => {
    const result = await createResponsibleController.handle({
      body: {
        name: 'any_name',
        identification: 'any_identification',
        address: 'any_address'
      }
    })
    expect(result).toEqual({
      code: 201,
      success: true
    })
  })
})