import { sameDay } from './sameDay'

describe('sameDay', () => {
  test('Should return true if both days are the same', () => {
    const date = new Date()
    const other = new Date()

    const result = sameDay(date, other)
    expect(result).toBe(true)
  })

  test('Should return false if both days aren\'t the same', () => {
    const date = new Date()
    const other = new Date()
    other.setDate(other.getDate() + 1)

    const result = sameDay(date, other)
    expect(result).toBe(false)
  })
})