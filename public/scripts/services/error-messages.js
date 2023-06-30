const map = {
  Unauthorized: 'Credenciais incorrectas. Tente novamente',
  Forbidden: 'Não possui permissão para executar essa ação',
  InvalidEntry: 'Insira correctamente os dados requisitados',
  DuplicatedData: 'Erro. Verifique dados repetidos',
  SchedulingLimit: 'Limite de agendamentos excedido para o dia requisitado',
  InvalidTiming: 'Não pode executar esta ação para este horário',
  ServerError: 'Algo correu mal. Tente novamente mais tarde'
}

function mapError(error) {
  if (map[error]) {
    return map[error]
  }
  return map.ServerError
}