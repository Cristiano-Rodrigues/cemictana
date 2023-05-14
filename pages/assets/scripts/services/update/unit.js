const table = document.getElementById('table')

async function getAllDefuncts () {
  const response = await request({
    url: 'http://localhost:8080/api/v1/unit',
    headers: {
      'x-access-token': token
    }
  })
  return response.result
}

getAllDefuncts().then(results => {
  fillDataTable (table, (results || []).map(result => ({
    tipo: result.type,
    localizacao: result.location,
    estado: result.state == 0 ? 'Vazio' : 'Ocupado'
  })))
})