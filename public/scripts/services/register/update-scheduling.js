const form = document.getElementById('form')
const alertDanger = document.getElementById('alert-danger')
const alertSuccess = document.getElementById('alert-success')
const token = localStorage.getItem('token')

form.addEventListener('submit', async evt => {
  evt.preventDefault()
  try {
    let message = 'Agendamento alterado'
    let response
    if (evt.submitter.id == "delete") {
      response = await deleteScheduling(form)
      message = 'Agendamento Removido'
    } else {
      response = await updateScheduling(form)
    }
    
    if (response.code >= 300 || !response.success) {
      alertDanger.querySelector('.message').innerText = mapError(response.error.name)
      alertSuccess.classList.remove('visible')
      alertDanger.classList.add('visible')
      return
    }
    alertDanger.classList.remove('visible')
    alertSuccess.classList.add('visible')
    alertSuccess.querySelector('.message').innerText = message
  } catch (error) {
    console.error(error)
  }
})


const deleteScheduling = async form => {
  const id = form.elements.id.value
  const url = `http://localhost:8080/api/v1/scheduling/${id}?token=${token}`
  const { status } = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    method: 'DELETE',
  })
  return {
    code: status,
    success: status == 204
  }
}

const updateScheduling = async form => {
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
  return response
}