async function request(params) {
  const response = await fetch(params.url, {
    headers: {
      'content-type': 'application/json'
    },
    ...params
  })
  const data = await response.json()

  return data
} 