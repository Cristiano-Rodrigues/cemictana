const map = {
  Unauthorized: 'Credenciais incorrectas. Tente novamente',
  InvalidEntry: 'Insira correctamente os dados requisitados',
  DuplicatedData: 'Nome ou identificação já existem'
}

function mapError(error) {
  if (map[error]) {
    return map[error]
  }
}