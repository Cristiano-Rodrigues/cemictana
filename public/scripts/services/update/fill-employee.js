const employee = document.getElementById('employee')

async function getEmployees () {
  const response = await request({
    url: 'http://localhost:8080/api/v1/employee',
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
  return response.result
}

getEmployees().then(results => {
  for (const result of results) {
    const option = createOption(result)
    employee.append(option)
  }
})

function createOption ({ id, name }) {
  const option = document.createElement('option')
  option.value = id
  option.innerText = name
  return option
}