const form = document.getElementById('form')
const alertDanger = document.getElementById('alert-danger')
const alertSuccess = document.getElementById('alert-success')
const token = localStorage.getItem('token')

form.addEventListener('submit', async evt => {
  evt.preventDefault()
  try {
    const response = await request({
      url: 'http://localhost:8080/api/v1/scheduling',
      method: 'PUT',
      body: JSON.stringify({
        id: form.elements.id.value,
        type: form.elements.type.value,
        schedulingDate: form.elements.schedulingDate.value,
        defunct: form.elements.defunct.value,
        unit: form.elements.unit.value,
        employee: form.elements.employee?.value || null,
        token
      })
    })
    
    if (response.code != 200 || !response.success) {
      alertDanger.querySelector('.message').innerText = mapError(response.error.name)
      alertSuccess.classList.remove('visible')
      alertDanger.classList.add('visible')
      return
    }
    alertDanger.classList.remove('visible')
    alertSuccess.classList.add('visible')
    alertSuccess.querySelector('.message').innerText = 'Agendamento alterado'
  } catch (error) {
    console.error(error)
  }
  form.reset()
})