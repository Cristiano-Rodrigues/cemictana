import { DuplicatedData, InvalidEntry , ServerError } from '../../errors/'
import { CreateUnitController } from './createUnit'

const ConnectionStub = class {
  close () {}
}
const UnitRepositoryStub = class {
  async getByLocation () {
    return null
  }
  async create () {}
}

const createUnitController = new CreateUnitController(
  ConnectionStub,
  UnitRepositoryStub
)

describe('CreateUnitController', () => {
  test('Should return an error object if null is given for any required value', async () => {
    const result = await createUnitController.handle({
      body: {
        type: null,
        location: 'any_location',
        state: 0
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof InvalidEntry)).toBe(true)
  })

  test('Should return an error object if a unit with same location already exists', async () => {
    const UnitRepositoryStub = class {
      getByLocation (location) {
        return {
          location
        }
      }
    }
    const createUnitController = new CreateUnitController(
      ConnectionStub,
      UnitRepositoryStub
    )

    const result = await createUnitController.handle({
      body: {
        type: 'any_type',
        location: 'any_location',
        state: 0
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof DuplicatedData)).toBe(true)
  })

  test('Should return an error object if any internal server error', async () => {
    const UnitRepositoryStub = class {
      getByIdentification (_) {
        throw new Error('any_error')
      }
    }
    const createUnitController = new CreateUnitController(
      ConnectionStub,
      UnitRepositoryStub
    )

    const result = await createUnitController.handle({
      body: {
        type: 'any_type',
        location: 'any_location',
        state: 0
      }
    })
    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return a success object if no error', async () => {
    const result = await createUnitController.handle({
      body: {
        type: 'any_type',
        location: 'any_location',
        state: 0
      }
    })
    expect(result).toEqual({
      code: 201,
      success: true
    })
  })
})