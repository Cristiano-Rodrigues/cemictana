
function setup () {
  const token = localStorage.getItem('token')
  Promise.all([
    getTotalEmployees(token),
    getTotalUnits(token),
    getTotalUsers(token)
  ]).then(([employees, units, users]) => {
    updateReports({ employees, units, users })
  })
}

setup()


async function getTotalEmployees (token) {
  return getTotal('http://localhost:8080/api/v1/employee', token)
}

async function getTotalUnits (token) {
  return getTotal('http://localhost:8080/api/v1/unit', token)
}

async function getTotalUsers (token) {
  return getTotal('http://localhost:8080/api/v1/user', token)
}

async function getTotal (url, token) {
  const response = await request({ url, headers: { 'x-access-token': token } })
  return response.result?.length
}

function updateReports (result) {
  document.getElementById('employees').innerText = result.employees
  document.getElementById('units').innerText = result.units
  document.getElementById('users').innerText = result.users
}