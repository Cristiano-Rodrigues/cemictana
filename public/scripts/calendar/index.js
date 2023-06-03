const calendar = document.getElementById('calendar')
const monthdays = calendar.querySelector('.monthdays')

let baseDate = new ExtDate()

function setup (baseDate) {
  const startDate = baseDate.set('date', 1)
  const daysToWeekStart = startDate.getDay() - 1
  let date = startDate.subtract('date', daysToWeekStart > - 1 ? daysToWeekStart : 6)

  monthdays.innerText = ''
  for (let day = 0; day < 7; day++) {
    for (let week = 0; week < 6; week++) {
      const element = renderDay(date.getDate())
      if (date.getMonth() === baseDate.getMonth()) {
        element.classList.add('current')
      }
      monthdays.append(element)
      date = date.next('date')
    }
  }
}

function renderDay (day) {
  const wrapperEl = document.createElement('div')
  const numberEl = document.createElement('div')
  const contentEl = document.createElement('div')

  wrapperEl.classList.add('monthday')
  numberEl.classList.add('number')
  contentEl.classList.add('content')

  numberEl.innerText = day

  wrapperEl.append(numberEl)
  wrapperEl.append(contentEl)

  return wrapperEl
}

function handleClick (action) {
  baseDate = action(baseDate)
  setup(baseDate)
  updateDateElements(baseDate)
}

;([
  document.getElementById('prev-month-main'),
  document.getElementById('prev-month')
]).forEach(button => {
  button.addEventListener('click', () => {
    handleClick(baseDate => {
      return baseDate.previous('month')
    })
  })
})

;([
  document.getElementById('next-month-main'),
  document.getElementById('next-month')
]).forEach(button => {
  button.addEventListener('click', () => {
    handleClick(baseDate => {
      return baseDate.next('month')
    })
  })
})

document.getElementById('prev-year').addEventListener('click', () => {
  handleClick(baseDate => {
    return baseDate.previous('year')
  })
})

document.getElementById('next-year').addEventListener('click', () => {
  handleClick(baseDate => {
    return baseDate.next('year')
  })
})

function updateDateElements (baseDate) {
  const monthEl = document.getElementById('month-value')
  const yearEl = document.getElementById('year-value')

  monthEl.innerText = baseDate.get('monthName')
  yearEl.innerText = baseDate.getFullYear()
}

setup(baseDate)
updateDateElements(baseDate)