const table = document.getElementById('table')

async function getAllDefuncts () {
  const response = await request({
    url: 'http://localhost:8080/api/v1/defunct/responsible',
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
  return response.result
}

getAllDefuncts().then(results => {
  fillDataTable (table, (results || []).map(result => ({
    nome: result.name,
    identificacao: result.identification,
    'Data de Nascimento': result.bornDate,
    'Date de Morte': result.deathDate
  })))
})