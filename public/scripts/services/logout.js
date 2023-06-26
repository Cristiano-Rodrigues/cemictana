const logoutBtn = document.getElementById('logout')

logoutBtn.addEventListener('click', async e => {
  e.preventDefault()
  await request({
    url: 'http://localhost:8080/api/v1/logout',
    method: 'POST'
  })
  const location = e.target.href
  window.location.href = location
})