const searchEl = document.getElementById('search')
const resultsCountEl = document.querySelector('.results-count')

searchUserInput('').then(results => {
  resultsCountEl.innerText = results.length
  showResults(results)
})

let timeoutId = null

searchEl.addEventListener('keyup', async evt => {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(async () => {
    const input = evt.target.value
    const results = await searchUserInput(input)

    changeTitle(evt.target.value)
    showResults(results)
  }, 500)
})

function changeTitle (search) {
  const titleEl = document.querySelector('.title-text')
  titleEl.innerText = `Resultados para "${search}"`
}

async function searchUserInput (input) {
  const response = await request({
    url: `http://localhost:8080/api/v1/search?search=${input}`
  })
  return response.result
}

function showResults (results) {
  const cardsEl = document.querySelector('.cards')

  cardsEl.innerText = ''
  resultsCountEl.innerText = results.length

  for (const result of results) {
    cardsEl.append(createCard(result))
  }
}

function createCard (result) {
  const date = result.deathDate.split('T')[0].replaceAll('-', '/')
  const cardEl = document.createElement('div')

  cardEl.innerHTML = `
    <div class="card">
      <i class="bx bx-expand-alt"></i>
      <div class="person-data">
        <img src="/images/profile-pq.png" alt="photo" class="photo">
        <div class="name">${result.name}</div>
      </div>
      <div class="death-date"><strong>Data</strong>: ${date}</div>
    </div>
  `
  return cardEl
}