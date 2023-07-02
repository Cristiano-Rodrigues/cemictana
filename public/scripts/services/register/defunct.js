const form = document.getElementById('form')
const alertDanger = document.getElementById('alert-danger')
const alertSuccess = document.getElementById('alert-success')
const token = localStorage.getItem('token')

form.addEventListener('submit', async evt => {
  evt.preventDefault()
  try {
    const response = await request({
      url: 'http://localhost:8080/api/v1/defunct',
      method: 'POST',
      body: JSON.stringify({
        name: form.elements.name.value,
        identification: form.elements.identification.value,
        responsible: form.elements.responsible?.value ??
          (JSON.parse(localStorage.getItem('user')))?.id,
        bornDate: form.elements.bornDate.value,
        deathDate: form.elements.deathDate.value,
        deathCause: form.elements.deathCause.value,
        token
      })
    })

    if (files.length == 2) {
      const formData = fulfillFormData(files)
      
      await requestUploadDefunctImage(response.defunct.id, formData)
    }
    
    if (response.code != 201 || !response.success) {
      alertDanger.querySelector('.message').innerText = mapError(response.error.name)
      alertSuccess.classList.remove('visible')
      alertDanger.classList.add('visible')
      return
    }

    alertDanger.classList.remove('visible')
    alertSuccess.classList.add('visible')
    alertSuccess.querySelector('.message').innerText = 'Defunto cadastrado'
  } catch (error) {
    console.error(error)
  }
  form.reset()
})

const { document: documentFile, image } = form.elements
const files = []
const onChange = evt => {
  const fileReader = new FileReader()
  const file = evt.target.files[0]
  fileReader.addEventListener('load', async () => {
    files.push({
      name: evt.target.name,
      file
    })
  })
  if (!file) return
  fileReader.readAsDataURL(file)
}
function fulfillFormData (files) {
  const formData = new FormData()
    
  for (const { name, file } of files) {
    formData.append(name, file)
  }

  return formData
}
async function requestUploadDefunctImage (defunctId, formData) {
  await fetch(
    `http://localhost:8080/api/v1/defunct/images?id=${defunctId}`, {
    headers: {
      'enctype': 'multipart/form-data'
    },
    method: 'PUT',
    body: formData
  })
}

documentFile.addEventListener('change', onChange)
image.addEventListener('change', onChange)