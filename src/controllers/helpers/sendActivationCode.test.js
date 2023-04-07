import { generateRandomCode } from "./random"
import { sendActivationCode } from "./sendActivationCode"

describe('sendActivationCode', () => {
  test('Should call mailer with correct params', async () => {
    const email = 'email@server.com'
    const code = generateRandomCode({ min: 100_000, max: 1_000_000 })
    const mailerStub = new class {
      async send ({ to, subject, html }) {
        expect(to).toBe(email)
        expect(subject).toBe('Account activation')
        expect(html).toBe(`Your activation code: ${code}`)
      }
    }

    sendActivationCode(email, code, mailerStub)
  })
})