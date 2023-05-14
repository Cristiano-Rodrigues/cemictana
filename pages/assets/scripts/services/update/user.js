const table = document.getElementById('table')

async function getAllDefuncts () {
  const response = await request({
    url: 'http://localhost:8080/api/v1/user',
    headers: {
      'x-access-token': token
    }
  })
  return response.result
}

getAllDefuncts().then(results => {
  fillDataTable (table, (results || []).map(result => ({
    nome: result.name,
    email: result.email,
    permissao: result.permission,
    estado: result.state == 0 ? 'Desativo' : 'Activo'
  })))
})