import { describe, it, expect } from 'vitest'
import { formatDate, buildMaxEventText } from './helpers.js'

describe('formatDate', () => {
  it('formats a timestamp as YYYY/MM/DD', () => {
    const timestamp = Date.UTC(2024, 0, 5)
    expect(formatDate(timestamp)).toBe('2024/01/05')
  })
})

describe('buildMaxEventText', () => {
  it('returns placeholder when event is missing', () => {
    expect(buildMaxEventText(null)).toBe('-')
  })

  it('builds the event summary text', () => {
    const event = {
      properties: {
        time: Date.UTC(2023, 6, 1),
        mag: 6.4,
        place: 'Near Test City'
      },
      geometry: {
        coordinates: [0, 0, 22]
      }
    }

    const text = buildMaxEventText(event)

    expect(text).toContain('2023/07/01')
    expect(text).toContain('Magnitud 6.4')
    expect(text).toContain('22km de profundidad')
    expect(text).toContain('Near Test City')
  })
})
