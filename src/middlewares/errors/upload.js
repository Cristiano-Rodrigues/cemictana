export class UploadError extends Error {
  constructor () {
    super('Something went wrong uploading image')
    this.name = 'UploadError'
  }
}
