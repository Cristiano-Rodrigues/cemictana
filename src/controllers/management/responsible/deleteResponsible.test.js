import { InvalidEntry, ServerError } from '../../errors/'
import { DeleteResponsibleController } from './deleteResponsible'

const ConnectionStub = class {
  close () {}
}
const ResponsibleRepositoryStub = class {
  async delete () {}
}

const deleteResponsibleController = new DeleteResponsibleController(
  ConnectionStub,
  ResponsibleRepositoryStub
)

describe('DeleteResponsibleController', () => {
  test('Should return an error object if no id is provided', async () => {
    const result = await deleteResponsibleController.handle({})
    expect(result).toEqual({
      code: 400,
      error: new InvalidEntry('id')
    })
  })

  test('Should return an error object if any internal server error', async () => {
    const ResponsibleRepositoryStub = class {
      delete () {
        throw new Error('any_error')
      }
    }
    const deleteResponsibleController = new DeleteResponsibleController(
      ConnectionStub,
      ResponsibleRepositoryStub
    )

  const result = await deleteResponsibleController.handle({
    params: {
      id: 1
    }
  })
    expect(result).toEqual({
      code: 500,
      error: new ServerError()
    })
  })

  test('Should return a success object if no error', async () => {
    const result = await deleteResponsibleController.handle({
      params: {
        id: 1
      }
    })
    expect(result).toEqual({
      code: 204,
      success: true
    })
  })
})