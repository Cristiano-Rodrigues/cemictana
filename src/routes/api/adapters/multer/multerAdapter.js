import multer from 'multer'

export class Uploader {
  constructor (config) {
    const storage = multer.diskStorage({
      destination: (_, __, cb) => {
        cb(null, config.location)
      },
      filename: (_, file, cb) => {
        const name = config.filename(file.originalname)
        cb(null, name)
      }
    })
    const fileFilter = (_, file, cb) => {
      const valid = config.fileFilter(file.mimetype)
      cb(null, valid)
    }
    this.uploadFn = multer({
      storage,
      fileFilter,
      limits: {
        fileSize: config.limit
      }
    }).fields([
      { name: 'image', maxCount: 1 },
      { name: 'document', maxCount: 1 }
    ])
  }

  async upload (req) {
    await (new Promise((resolve) => {
      this.uploadFn(req, null, resolve)
    }))

    return {
      success: true
    }
  }
}
