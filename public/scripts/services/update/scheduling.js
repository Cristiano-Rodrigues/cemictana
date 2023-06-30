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
    data: result.schedulingDate.replace('T', ' ').replace(':00.000Z', ''),
    estado: findState(result)
  })))
})

function findState ({ state, deleted }) {
  const response = ['Em análise', 'Reprovado', 'Aprovado', 'Reprovado']
  let pos = 0
  if (state == 1) pos += 2
  if (deleted == 1) pos += 1
  return response[pos]
}