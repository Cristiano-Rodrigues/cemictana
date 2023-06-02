const unit = document.getElementById('unit')

async function getUnits () {
  const response = await request({
    url: 'http://localhost:8080/api/v1/unit',
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
  return response.result
}

getUnits().then(results => {
  for (const result of results) {
    const option = createOption({
      ...result,
      name: result.type + '-' + result.location
    })
    unit.append(option)
  }
})