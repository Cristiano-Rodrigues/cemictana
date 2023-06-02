const defunct = document.getElementById('defunct')

async function getDefuncts () {
  const response = await request({
    url: 'http://localhost:8080/api/v1/defunct/responsible',
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
  return response.result
}

getDefuncts().then(results => {
  for (const result of results) {
    const option = createOption(result)
    defunct.append(option)
  }
})

function createOption ({ id, name }) {
  const option = document.createElement('option')
  option.value = id
  option.innerText = name
  return option
}