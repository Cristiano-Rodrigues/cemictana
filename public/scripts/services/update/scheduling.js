const table = document.getElementById('table')

async function getAllScheduling () {
  const response = await request({
    url: 'http://localhost:8080/api/v1/scheduling',
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
  return response.result
}

getAllScheduling().then(results => {
  fillDataTable (table, (results || []).map(result => ({
    tipo: result.type,
    data: result.schedulingDate,
  })))
})