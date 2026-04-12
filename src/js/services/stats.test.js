import { describe, it, expect } from 'vitest'
import {
  getMagnitudeStats,
  averageTimeBetween,
  earthquakeProbabilityTable,
  last5Earthquakes
} from './stats.js'

function makeQuake({ mag, time, depth = 10, place = 'Test place' }) {
  return {
    properties: {
      mag,
      time,
      place,
      url: 'https://example.com/event'
    },
    geometry: {
      coordinates: [0, 0, depth]
    }
  }
}

describe('getMagnitudeStats', () => {
  it('returns placeholder values when no valid magnitudes exist', () => {
    const quakes = [makeQuake({ mag: null, time: 1000 }), makeQuake({ mag: undefined, time: 2000 })]

    expect(getMagnitudeStats(quakes)).toEqual({
      mean: '-',
      max: '-',
      maxEvent: null
    })
  })

  it('calculates mean and max correctly', () => {
    const quakeA = makeQuake({ mag: 4.2, time: 1000 })
    const quakeB = makeQuake({ mag: 5.8, time: 2000 })
    const quakeC = makeQuake({ mag: 3.0, time: 3000 })

    const result = getMagnitudeStats([quakeA, quakeB, quakeC])

    expect(result.mean).toBe(4.33)
    expect(result.max).toBe(5.8)
    expect(result.maxEvent).toBe(quakeB)
  })
})

describe('averageTimeBetween', () => {
  it('returns 0 when less than 2 earthquakes exist', () => {
    expect(averageTimeBetween([makeQuake({ mag: 4, time: 1000 })])).toBe(0)
  })

  it('returns average in days regardless of input order', () => {
    const day = 1000 * 60 * 60 * 24
    const quakes = [
      makeQuake({ mag: 4, time: day * 4 }),
      makeQuake({ mag: 4, time: day * 1 }),
      makeQuake({ mag: 4, time: day * 2 })
    ]

    expect(averageTimeBetween(quakes)).toBe(1.5)
  })
})

describe('earthquakeProbabilityTable', () => {
  it('returns empty array when no earthquakes are provided', () => {
    expect(earthquakeProbabilityTable([])).toEqual([])
    expect(earthquakeProbabilityTable(null)).toEqual([])
  })

  it('returns expected structure and values for a simple dataset', () => {
    const yearMs = 1000 * 60 * 60 * 24 * 365
    const quakes = [
      makeQuake({ mag: 6.1, time: 0 }),
      makeQuake({ mag: 5.0, time: yearMs })
    ]

    const table = earthquakeProbabilityTable(quakes, 1, [5, 6])

    expect(table).toHaveLength(2)
    expect(table[0]).toMatchObject({
      minMagnitude: 5,
      events: 2,
      lambda: '2.000'
    })
    expect(table[1]).toMatchObject({
      minMagnitude: 6,
      events: 1,
      lambda: '1.000'
    })
    expect(table[0].risk).toBe('Muy alto')
    expect(table[1].risk).toBe('Alto')
  })
})

describe('last5Earthquakes', () => {
  it('returns latest 5 quakes sorted desc and does not mutate input', () => {
    const quakes = [
      makeQuake({ mag: 1, time: 1000 }),
      makeQuake({ mag: 1, time: 2000 }),
      makeQuake({ mag: 1, time: 3000 }),
      makeQuake({ mag: 1, time: 4000 }),
      makeQuake({ mag: 1, time: 5000 }),
      makeQuake({ mag: 1, time: 6000 })
    ]
    const originalTimes = quakes.map(q => q.properties.time)

    const result = last5Earthquakes(quakes)

    expect(result).toHaveLength(5)
    expect(result.map(q => q.properties.time)).toEqual([6000, 5000, 4000, 3000, 2000])
    expect(quakes.map(q => q.properties.time)).toEqual(originalTimes)
  })
})
