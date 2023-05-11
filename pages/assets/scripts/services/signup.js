const form = document.getElementById('form')
const alert = document.getElementById('alert')
const message = alert.querySelector('.message')

form.addEventListener('submit', async evt => {
  evt.preventDefault()

  try {
    const response = await request({
      url: 'http://localhost:8080/api/v1/signup',
      method: 'POST',
      body: JSON.stringify({
        name: form.elements.name.value,
        identification: form.elements.identification.value,
        email: form.elements.email.value,
        password: form.elements.password.value
      })
    })

    if (response.code != 201 || !response.success) {
      message.innerText = mapError(response.error.name)
      alert.classList.add('visible')
      return
    }

    window.location.href = './login'
  } catch (error) {
    console.error(error)
  }
  
})