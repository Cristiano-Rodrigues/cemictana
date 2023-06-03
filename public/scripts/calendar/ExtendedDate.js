class ExtDate extends Date {
  constructor (date = new Date) {
    super(date)
  }

  next (unit) {
    const step = 1
    return this.set(unit, this.get(unit) + step)
  }

  previous (unit) {
    const step = 1
    return this.set(unit, this.get(unit) - step)
  }

  add (unit, step) {
    return this.set(unit, this.get(unit) + step)
  }

  subtract (unit, step) {
    return this.set(unit, this.get(unit) - step)
  }

  get (unit) {
    if (unit && getActions[unit]) {
      const action = getActions[unit]
      const value = action(this)
      return value
    }
  }

  set (unit, value) {
    if (unit && setActions[unit]) {
      const action = setActions[unit]
      const date = action(this, value)
      return new ExtDate(date)
    }
  }
}

const setActions = {
  date (date, value) {
    const d = new Date(date)
    d.setDate(value)
    return d
  },

  month (date, value) {
    const d = new Date(date)
    d.setMonth(value)
    return d
  },

  year (date, value) {
    const d = new Date(date)
    d.setFullYear(value)
    return d
  }
}

const getActions = {
  day (date) {
    return date.getDay()
  },

  date (date) {
    return date.getDate()
  },

  month (date) {
    return date.getMonth()
  },

  monthName (date) {
    const month = date.getMonth()
    return (
      ('Janeiro,Fevereiro,Março,Abril,Maio,Junho,' +
      'Julho,Agosto,Setembro,Outubro,Novembro,Dezembro').split(',')
    )[month]
  },

  year (date) {
    return date.getFullYear()
  }
}