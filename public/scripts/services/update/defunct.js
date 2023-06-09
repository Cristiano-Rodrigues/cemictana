const table = document.getElementById('table')

async function getAllDefuncts () {
  const response = await request({
    url: 'http://localhost:8080/api/v1/defunct',
    headers: {
      'x-access-token': token
    }
  })
  return response.result
}

getAllDefuncts().then(results => {
  fillDataTable (table, (results || []).map(result => ({
    nome: result.name,
    identificacao: result.identification,
    'Data de Nascimento': result.bornDate.replace('T', ' ').replace(':00.000Z', ''),
    'Date de Morte': result.deathDate.replace('T', ' ').replace(':00.000Z', '')
  })))
})