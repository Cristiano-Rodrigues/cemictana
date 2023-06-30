const calendar = document.getElementById('calendar')
const monthdays = calendar.querySelector('.monthdays')
const wrapper = document.getElementById('update-form')

let baseDate = new ExtDate()
let schedules

async function getAllScheduling () {
  const response = await request({
    url: 'http://localhost:8080/api/v1/scheduling',
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
  return response.result
}

function setup (baseDate) {
  const sameDate = (date, event) => (
    date.getFullYear() == event.date.getFullYear() &&
    date.getMonth() == event.date.getMonth() &&
    date.getDate() == event.date.getDate()
  )

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
      const events = schedules.filter(sameDate.bind(null, date))
      events.forEach(event => {
        element.append(renderEvent(event))
      })
      monthdays.append(element)
      date = date.next('date')
    }
  }
}

function renderDay (day) {
  const wrapperEl = document.createElement('div')
  const numberEl = document.createElement('div')

  wrapperEl.classList.add('monthday')
  numberEl.classList.add('number')

  numberEl.innerText = day

  wrapperEl.append(numberEl)

  return wrapperEl
}

function renderEvent (event) {
  const eventEl = document.createElement('div')

  eventEl.className = `event ${event.type}`
  eventEl.innerText = event.type

  eventEl.addEventListener('click', () => {
    openUpdateForm()
    fullFillForm(event)
  })

  return eventEl
}

function handleClick (action) {
  baseDate = action(baseDate)
  setup(baseDate)
  updateDateElements(baseDate)
}

function updateDateElements (baseDate) {
  const monthEl = document.getElementById('month-value')
  const yearEl = document.getElementById('year-value')

  monthEl.innerText = baseDate.get('monthName')
  yearEl.innerText = baseDate.getFullYear()
}

function openUpdateForm () {
  wrapper.classList.add('visible')
}

async function fullFillForm (event) {
  const getDefunct = async () => {
    const response = await request({
      url: `http://localhost:8080/api/v1/defunct`,
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })
    return response.result.find(({ id }) => id == event.defunct)
  }

  const getUnit = async () => {
    const response = await request({
      url: `http://localhost:8080/api/v1/unit`,
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })
    return response.result.find(({ id }) => id == event.unit)
  }

  const padTo2Digits = num => (
    num.toString().padStart(2, '0')
  )

  const formatDate = date => {
    return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-').concat([
      ' ',
      padTo2Digits(date.getHours()),
      ':',
      padTo2Digits(date.getMinutes())
    ].join(''))
  }

  const defunct = await getDefunct()
  const unit = await getUnit()

  form.elements.id.value = event.id
  form.elements.schedulingDate.value = formatDate(event.date)
  form.elements.defunct.append(createOption(defunct))
  form.elements.type.value = event.type
  form.elements.unit.append(createOption({
    ...unit,
    name: unit.type + '-' + unit.location
  }))
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


document.getElementById('close-btn').addEventListener('click', () => {
  wrapper.classList.remove('visible')
})

getAllScheduling().then(results => {
  schedules = results.map(result => ({
    ...result,
    date: new ExtDate(result.schedulingDate)
  }))
  setup(baseDate)
  updateDateElements(baseDate)
})