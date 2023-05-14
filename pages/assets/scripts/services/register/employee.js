const form = document.getElementById('form')
const alertDanger = document.getElementById('alert-danger')
const alertSuccess = document.getElementById('alert-success')
const token = localStorage.getItem('token')

form.addEventListener('submit', async evt => {
  evt.preventDefault()
  try {
    const response = await request({
      url: 'http://localhost:8080/api/v1/employee',
      method: 'POST',
      body: JSON.stringify({
        name: form.elements.name.value,
        identification: form.elements.identification.value,
        post: form.elements.post.value,
        bornDate: form.elements.bornDate.value,
        address: form.elements.address.value,
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
    alertSuccess.querySelector('.message').innerText = 'Funcionário cadastrado'
  } catch (error) {
    console.error(error)
  }
  form.reset()
})