import { UploadError } from './errors'
import path from 'path'

export class ImageUpload {
  constructor (uniqueIdGenerator, Uploader) {
    this.uniqueIdGenerator = uniqueIdGenerator
    this.Uploader = Uploader
  }

  async handle (req) {
    const location = path.join(process.cwd(), '/uploads/')
    const filename = originalName => {
      const name = this.uniqueIdGenerator() + '-' + originalName
      req.filenames.push(name)
      return name
    }
    const fileFilter = mimetype => (
      ['image/jpeg', 'image/png'].includes(mimetype)
    )

    const $10megabytes = 1024 * 1024 * 10
    req.filenames = []

    const uploader = new this.Uploader({
      location,
      filename,
      fileFilter,
      limit: $10megabytes
    })

    try {
      await uploader.upload(req)
    } catch (error) {
      return {
        code: 400,
        error: new UploadError()
      }
    }

    return {
      success: true,
      code: 201
    }
  }
}
