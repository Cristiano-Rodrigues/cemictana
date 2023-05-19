import { DuplicatedData, InvalidEntry, ServerError } from '../../errors/'
import { UpdateDefunctController } from './updateDefunct'

const ConnectionStub = class {
  close () {}
}
const DefunctRepositoryStub = class {
  async getByIdentification () {
    return null
  }
  async update () {}
}
const ResponsibleRepositoryStub = class {
  async getById (id) {
    return {
      id
    }
  }
}

const updateDefunctController = new UpdateDefunctController(
  ConnectionStub,
  DefunctRepositoryStub,
  ResponsibleRepositoryStub
)

const tomorrow = () => {
  const d = new Date()
  const datestring = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() + 1}`
  return datestring
}

describe('UpdateDefunctController', () => {
  test('Should return an error object if null is given for any required value', async () => {
    const result = await updateDefunctController.handle({
      body: {
        id: null,
        name: 'any_name',
        identification: 'any_identification',
        responsible: 1,
        bornDate: '2023-04-06',
        deathDate: '2023-04-06'
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof InvalidEntry)).toBe(true)
  })

  test('Should return an error object if given bornDate or deathDate are after current date', async () => {
    const result = await updateDefunctController.handle({
      body: {
        id: 1,
        name: 'any_name',
        identification: 'any_identification',
        responsible: 1,
        bornDate: tomorrow(),
        deathDate: tomorrow()
      }
    })
    expect(result).toEqual({
      code: 400,
      error: new InvalidEntry('bornDate or deathDate')
    })
  })

  test('Should return an error object if defunct already exists', async () => {
    const DefunctRepositoryStub = class {
      getByIdentification (identification) {
        return {
          id: 2,
          identification
        }
      }
    }
    const updateDefunctController = new UpdateDefunctController(
      ConnectionStub,
      DefunctRepositoryStub,
      ResponsibleRepositoryStub
    )

    const result = await updateDefunctController.handle({
      body: {
        id: 1,
        name: 'any_name',
        identification: 'any_identification',
        responsible: 1,
        bornDate: '2023-04-06',
        deathDate: '2023-04-06'
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof DuplicatedData)).toBe(true)
  })

  test('Should return an error object if responsible not exists', async () => {
    const ResponsibleRepositoryStub = class {
      getById (id) {
        return null
      }
    }
    const updateDefunctController = new UpdateDefunctController(
      ConnectionStub,
      DefunctRepositoryStub,
      ResponsibleRepositoryStub
    )

    const result = await updateDefunctController.handle({
      body: {
        id: 1,
        name: 'any_name',
        identification: 'any_identification',
        responsible: 1,
        bornDate: '2023-04-06',
        deathDate: '2023-04-06'
      }
    })
    expect(result).toEqual({
      code: 400,
      error: new InvalidEntry('responsible')
    })
  })

  test('Should return an error object if any internal server error', async () => {
    const DefunctRepositoryStub = class {
      getByIdentification (_) {
        throw new Error('any_error')
      }
    }
    const updateDefunctController = new UpdateDefunctController(
      ConnectionStub,
      DefunctRepositoryStub,
      ResponsibleRepositoryStub
    )

    const result = await updateDefunctController.handle({
      body: {
        id: 1,
        name: 'any_name',
        identification: 'any_identification',
        responsible: 1,
        bornDate: '2023-04-06',
        deathDate: '2023-04-06'
      }
    })
    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return a success object if no error', async () => {
    const result = await updateDefunctController.handle({
      body: {
        id: 1,
        name: 'any_name',
        identification: 'any_identification',
        responsible: 1,
        bornDate: '2023-04-06',
        deathDate: '2023-04-06',
        deathCause: 'any_cause'
      }
    })
    expect(result).toEqual({
      code: 200,
      success: true
    })
  })
})