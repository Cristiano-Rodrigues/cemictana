const form = document.getElementById('form')
const alert = document.getElementById('alert')
const message = alert.querySelector('.message')

form.addEventListener('submit', async evt => {
  evt.preventDefault()

  try {
    const response = await fetch('http://localhost:8080/api/v1/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: form.elements.email.value,
        password: form.elements.password.value
      })
    })

    const data = await response.json()
    if (data.code != 200 || !data.success) {
      console.log(data.error)
      message.innerText = mapError(data.error.name)
      alert.classList.add('visible')
    }
    localStorage.setItem('token', data.result.token)
    window.location.href = './standard/'
  } catch (error) {
    console.error(error)
  }
  
})