import { DuplicatedData, InvalidEntry, ServerError } from '../../errors/'
import { UpdateResponsibleController } from './updateResponsible'

const ConnectionStub = class {
  close () {}
}
const ResponsibleRepositoryStub = class {
  async getByIdentification () {
    return null
  }
  async update () {}
}

const updateResponsibleController = new UpdateResponsibleController(
  ConnectionStub,
  ResponsibleRepositoryStub
)

const tomorrow = () => {
  const d = new Date()
  const datestring = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() + 1}`
  return datestring
}

describe('UpdateResponsibleController', () => {
  test('Should return an error object if null is given for any required value', async () => {
    const result = await updateResponsibleController.handle({
      body: {
        id: null,
        name: 'any_name',
        identification: 'any_identification',
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof InvalidEntry)).toBe(true)
  })

  test('Should return an error object if given bornDate is after current date', async () => {
    const result = await updateResponsibleController.handle({
      body: {
        id: 1,
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
          id: 1,
          identification
        }
      }
    }
    const updateResponsibleController = new UpdateResponsibleController(
      ConnectionStub,
      ResponsibleRepositoryStub
    )

    const result = await updateResponsibleController.handle({
      body: {
        id: 2,
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
    const updateResponsibleController = new UpdateResponsibleController(
      ConnectionStub,
      ResponsibleRepositoryStub
    )

    const result = await updateResponsibleController.handle({
      body: {
        id: 1,
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
    const result = await updateResponsibleController.handle({
      body: {
        id: 1,
        name: 'any_name',
        identification: 'any_identification',
        address: 'any_address'
      }
    })
    expect(result).toEqual({
      code: 200,
      success: true
    })
  })
})