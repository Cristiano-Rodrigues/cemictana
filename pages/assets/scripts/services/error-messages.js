const map = {
  Unauthorized: 'Credenciais incorrectas. Tente novamente',
  InvalidEntry: 'Insira correctamente os dados requisitados',
  DuplicatedData: 'Nome ou identificação já existem',
  ServerError: 'Algo correu mal. Tente novamente mais tarde'
}

function mapError(error) {
  if (map[error]) {
    return map[error]
  }
}