const form = document.getElementById('form')
const alertDanger = document.getElementById('alert-danger')
const alertSuccess = document.getElementById('alert-success')
const token = localStorage.getItem('token')

form.addEventListener('submit', async evt => {
  evt.preventDefault()
  try {
    const response = await request({
      url: 'http://localhost:8080/api/v1/unit',
      method: 'POST',
      body: JSON.stringify({
        type: form.elements.type.value,
        location: form.elements.location.value,
        state: form.elements.state.value,
        token
      })
    })
    
    if (response.code != 201 || !response.success) {
      alertDanger.querySelector('.message').innerText = mapError(response.error.name)
      alertSuccess.classList.remove('visible')
      alertDanger.classList.add('visible')
      return
    }
    alertDanger.classList.remove('visible')
    alertSuccess.classList.add('visible')
    alertSuccess.querySelector('.message').innerText = 'Unidade cadastrada'
  } catch (error) {
    console.error(error)
  }
  form.reset()
})