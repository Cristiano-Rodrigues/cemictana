const addButton = document.getElementById('add-button')
const closeBtn = document.getElementById('close-btn')

const handleClick = (evtTarget, action) => {
  const targetId = evtTarget.dataset.relto
  const target = document.getElementById(targetId)
  if (!target) return
  action(target)
}

addButton.addEventListener('click', () => {
  handleClick(addButton, target => {
    target.classList.add('visible')
  })
})

closeBtn.addEventListener('click', () => {
  handleClick(addButton, target => {
    target.classList.remove('visible')
  })
})