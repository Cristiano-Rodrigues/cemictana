const addButton = document.getElementById('add-button')

addButton.addEventListener('click', () => {
  const targetId = addButton.dataset.relto
  const target = document.getElementById(targetId)
  if (!target) return
  target.classList.add('visible')  
})