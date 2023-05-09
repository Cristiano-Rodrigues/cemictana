const form = document.getElementById('form')
const alert = document.getElementById('alert')
const message = alert.querySelector('.message')

form.addEventListener('submit', async evt => {
  evt.preventDefault()
  const token = localStorage.getItem('token')

  try {
    let response = await request({
      url: 'http://localhost:8080/api/v1/responsible',
      method: 'POST',
      body: JSON.stringify({
        name: form.elements.name.value,
        identification: form.elements.identification.value,
        token
      })
    })

    if (response.code != 201 || !response.success) {
      message.innerText = mapError(response.error.name)
      alert.classList.add('visible')
      return
    }

    response = await request({
      url: 'http://localhost:8080/api/v1/user',
      method: 'POST',
      body: JSON.stringify({
        name: form.elements.name.value,
        email: form.elements.email.value,
        password: form.elements.password.value,
        permission: 'standard',
        token
      })
    })

    if (response.code != 201 || !response.success) {
      message.innerText = mapError(response.error.name)
      alert.classList.add('visible')
      return
    }

    window.location.href = './login.html'
  } catch (error) {
    console.error(error)
  }
  
})