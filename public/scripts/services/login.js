const form = document.getElementById('form')
const alert = document.getElementById('alert')
const message = alert.querySelector('.message')

form.addEventListener('submit', async evt => {
  evt.preventDefault()

  try {
    const response = await request({
      url: 'http://localhost:8080/api/v1/login',
      method: 'POST',
      body: JSON.stringify({
        email: form.elements.email.value,
        password: form.elements.password.value
      })
    })
    if (response.code != 200 || !response.success) {
      message.innerText = mapError(response.error.name)
      alert.classList.add('visible')
      return
    }
    localStorage.setItem('token', response.result.token)
    localStorage.setItem('user', JSON.stringify(response.result.user))
    window.location.href = './user/'
  } catch (error) {
    console.error(error)
  }
  
})