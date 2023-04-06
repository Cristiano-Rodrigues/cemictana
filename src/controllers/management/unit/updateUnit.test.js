import { DuplicatedData, InvalidEntry, ServerError } from '../../errors/'
import { UpdateUnitController } from './updateUnit'

const ConnectionStub = class {
  close () {}
}
const UnitRepositoryStub = class {
  async getByLocation (location) {
    return {
      id: 1,
      location
    }
  }
  async update () {}
}

const updateUnitController = new UpdateUnitController(
  ConnectionStub,
  UnitRepositoryStub
)

describe('UpdateUnitController', () => {
  test('Should return an error object if null is given for any required value', async () => {
    const result = await updateUnitController.handle({
      body: {
        id: null,
        type: 'any_type',
        location: 'any_location',
        state: 0
      }
    })
    expect(result.code).toBe(400)
    expect((result.error instanceof InvalidEntry)).toBe(true)
  })

  test('Should return an error object if unit location is already used', async () => {
    const UnitRepositoryStub = class {
      getByLocation (location) {
        return {
          id: 2,
          location
        }
      }
    }
    const updateUnitController = new UpdateUnitController(
      ConnectionStub,
      UnitRepositoryStub
    )

    const result = await updateUnitController.handle({
      body: {
        id: 1,
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
      getByLocation (_) {
        throw new Error('any_error')
      }
    }
    const updateUnitController = new UpdateUnitController(
      ConnectionStub,
      UnitRepositoryStub
    )

    const result = await updateUnitController.handle({
      body: {
        id: 1,
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
    const result = await updateUnitController.handle({
      body: {
        id: 1,
        type: 'any_type',
        location: 'any_location',
        state: 0
      }
    })
    expect(result).toEqual({
      code: 200,
      success: true
    })
  })
})