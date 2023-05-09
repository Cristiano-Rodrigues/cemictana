import ejs from 'ejs'
import { promisify } from 'util'

const pRenderFile = promisify(ejs.renderFile).bind(ejs)

export class HTMLTemplateEngine {
  async load (fileSrc, data) {
    const file = await pRenderFile(fileSrc, data)

    return file
  }
}
