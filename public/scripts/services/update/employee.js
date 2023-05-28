const table = document.getElementById('table')

async function getAllDefuncts () {
  const response = await request({
    url: 'http://localhost:8080/api/v1/employee',
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
    funcao: result.post,
    'Data de Nascimento': result.bornDate,
    Endereco: result.address
  })))
})