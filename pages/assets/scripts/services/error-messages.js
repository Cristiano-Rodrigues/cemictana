const map = {
  Unauthorized: 'Credenciais incorrectas. Tente novamente',
  InvalidEntry: 'Insira correctamente os dados requisitados',
  DuplicatedData: 'Erro. Verifique dados repetidos',
  ServerError: 'Algo correu mal. Tente novamente mais tarde'
}

function mapError(error) {
  if (map[error]) {
    return map[error]
  }
  return map.ServerError
}