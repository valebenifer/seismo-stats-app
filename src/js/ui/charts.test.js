import { beforeEach, describe, expect, it, vi } from 'vitest'

const chartMocks = vi.hoisted(() => {
  const destroy = vi.fn()
  const chartInstance = { destroy }

  return {
    destroy,
    chartInstance,
    chartConstructor: vi.fn(() => chartInstance),
    getChart: vi.fn(() => null)
  }
})

vi.mock('chart.js/auto', () => ({
  default: Object.assign(chartMocks.chartConstructor, {
    getChart: chartMocks.getChart
  })
}))

import { depthDistribution } from './charts.js'

describe('depthDistribution', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.stubGlobal('document', {
      getElementById: vi.fn(() => ({ getContext: vi.fn() }))
    })
  })

  it('returns the shallowest earthquake among the highest magnitudes', () => {
    const deepHighMagnitude = {
      properties: {
        mag: 6.2,
        time: Date.UTC(2025, 0, 10),
        place: 'Evento profundo',
        url: 'https://example.com/deep'
      },
      geometry: {
        coordinates: [0, 0, 32]
      }
    }

    const shallowHighMagnitude = {
      properties: {
        mag: 6.2,
        time: Date.UTC(2025, 0, 11),
        place: 'Evento somero',
        url: 'https://example.com/shallow'
      },
      geometry: {
        coordinates: [0, 0, 14]
      }
    }

    const lowerMagnitude = {
      properties: {
        mag: 5.8,
        time: Date.UTC(2025, 0, 12),
        place: 'Evento menor',
        url: 'https://example.com/lower'
      },
      geometry: {
        coordinates: [0, 0, 8]
      }
    }

    const result = depthDistribution([
      deepHighMagnitude,
      shallowHighMagnitude,
      lowerMagnitude
    ])

    expect(result).toBe(shallowHighMagnitude)
    expect(chartMocks.chartConstructor).toHaveBeenCalledTimes(1)
  })
})