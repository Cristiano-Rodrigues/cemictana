export async function sendActivationCode (email, code, mailer) {
  const subject = 'Account activation'
  const html = `Your activation code: ${code}`

  await mailer.send({
    to: email,
    subject,
    html
  })
}