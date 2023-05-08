const alerts = document.querySelectorAll('.alert')

Array.from(alerts).forEach(alert => {
  const closeBtn = alert.querySelector('.close-btn')

  closeBtn.addEventListener('click', () => {
    alert.classList.toggle('visible')
  })
})