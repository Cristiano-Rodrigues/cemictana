const responsible = document.getElementById('responsible')

async function getResponsibles () {
  const response = await request({
    url: 'http://localhost:8080/api/v1/responsible',
    headers: {
      'x-access-token': token
    }
  })
  return response.result
}

getResponsibles().then(results => {
  for (const result of results) {
    const option = createOption(result)
    responsible.append(option)
  }
})

function createOption ({ name, user }) {
  const option = document.createElement('option')
  option.value = user
  option.innerText = name
  return option
}