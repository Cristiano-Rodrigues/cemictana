const userDataEl = document.querySelector('.user-data')

userDataEl.addEventListener('click', () => {
  const hiddenBoxEl = userDataEl.querySelector('.hidden-box')
  hiddenBoxEl.classList.toggle('visible')
})