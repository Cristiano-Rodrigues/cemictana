import { InvalidEntry } from '../../errors'
import { UploadDocImagesController } from './uploadDocImages'

class ConnectionStub {
  close () {}
}
class DefunctRepositoryStub {
  async getById (id) {
    return {
      id
    }
  }
  async update (id, updateDefunct) {}
}
const req = {
  filenames: [
    'any_filename',
    'any_other_filename'
  ],
  query: {
    id: 1
  }
}

describe('UploadDocImages', () => {
  test('Should return an error object if filenames property is invalid', async () => {
    const req = {
      filenames: null,
      query: {
        id: 1
      }
    }
    const uploadController = new UploadDocImagesController(
      ConnectionStub,
      DefunctRepositoryStub
    )
    const response = await uploadController.handle(req)
    expect(response).toEqual({
      code: 400,
      error: new InvalidEntry('filenames')
    })
  })

  test('Should return an error object if invalid defunct id is given in query', async () => {
    const req = {
      filenames: [],
      query: {
        id: 'any_invalid_id'
      }
    }
    class DefunctRepositoryStub {
      async getById (id) {
        return null
      }
    }
    const uploadController = new UploadDocImagesController(
      ConnectionStub,
      DefunctRepositoryStub
    )
    const response = await uploadController.handle(req)
    expect(response).toEqual({
      code: 400,
      error: new InvalidEntry('defunct')
    })
  })

  test('Should return DefunctRepository.udpate method with filenames', async () => {
    class DefunctRepositoryStub {
      async getById (id) {
        return {
          id
        }
      }
      async update (id, updateDefunct) {
        expect(updateDefunct).toEqual({
          id,
          imageUrl: req.filenames[0],
          identificationFileUrl: req.filenames[1]
        })
      }
    }
    const uploadController = new UploadDocImagesController(
      ConnectionStub,
      DefunctRepositoryStub
    )
    await uploadController.handle(req)
  })

  test('Should return a success object if no error', async () => {
    const uploadController = new UploadDocImagesController(
      ConnectionStub,
      DefunctRepositoryStub
    )
    const response = await uploadController.handle(req)
    expect(response).toEqual({
      code: 200,
      success: true
    })
  })
})