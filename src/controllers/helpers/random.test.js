import { generateRandomCode } from './random'

describe('generateRandomCode', () => {
  test('ensure it gives a random number between min-max range', () => {
    const random = generateRandomCode({ min: 5, max: 10 })
    expect(random >= 5).toBe(true)
    expect(random < 10).toBe(true)
  })

  test('ensure it works properly with negative numbers', () => {
    const random = generateRandomCode({ min: -10, max: -5 })
    expect(random >= -10).toBe(true)
    expect(random < -5).toBe(true)
  })

  test('ensure it works even when wrong values are given', () => {
    const random = generateRandomCode({ min: 10, max: 5 })
    expect(random >= 5).toBe(true)
    expect(random < 10).toBe(true)
  })
})