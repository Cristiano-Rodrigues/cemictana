import nodemailer from 'nodemailer'
import { promisify } from 'util'

const {
  MAIL_HOST: host,
  MAIL_USER: user,
  MAIL_PASS: pass
} = process.env

export class Mailer {
  constructor () {
    this.transporter = nodemailer.createTransport({
      host,
      secure: true,
      auth: {
        user,
        pass
      }
    })
  }

  async send (options) {
    const sendMail = promisify(this.transporter.sendMail).bind(this.transporter)
    await sendMail({
      from: user,
      ...options
    })
  }
}