const map = {
  Unauthorized: 'Credenciais incorrectas. Tente novamente',
  InvalidEntry: 'Insira correctamente os dados requisitados'
}

function mapError(error) {
  if (map[error]) {
    return map[error]
  }
}