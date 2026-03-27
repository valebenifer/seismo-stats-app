import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getEarthquakes, top5DangerousEarthquakes } from './earthquakes.js'

function makeFeature(mag, time = 0) {
  return {
    properties: {
      mag,
      time,
      place: 'Test place',
      url: 'https://example.com'
    },
    geometry: {
      coordinates: [0, 0, 10]
    }
  }
}

describe('getEarthquakes', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('throws when USGS request fails', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    })

    await expect(getEarthquakes(40.4, -3.7, 50)).rejects.toThrow(
      'Error fetching earthquakes: 500 Internal Server Error'
    )
  })

  it('returns empty array when features is missing', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({})
    })

    const result = await getEarthquakes(40.4, -3.7, 50)

    expect(result).toEqual([])
  })

  it('returns features and builds query params correctly', async () => {
    const features = [makeFeature(4.3), makeFeature(5.1)]
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ features })
    })

    const result = await getEarthquakes(40.4, -3.7, 25)

    expect(result).toBe(features)
    expect(fetch).toHaveBeenCalledTimes(1)
    const url = fetch.mock.calls[0][0]
    expect(url).toContain('https://earthquake.usgs.gov/fdsnws/event/1/query?')
    expect(url).toContain('format=geojson')
    expect(url).toContain('latitude=40.4')
    expect(url).toContain('longitude=-3.7')
    expect(url).toContain('maxradiuskm=25')
    expect(url).toContain('starttime=1900-01-01')
    expect(url).toMatch(/endtime=\d{4}-\d{2}-\d{2}/)
  })
})

describe('top5DangerousEarthquakes', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('throws when USGS request fails', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable'
    })

    await expect(top5DangerousEarthquakes()).rejects.toThrow(
      'Error fetching earthquakes: 503 Service Unavailable'
    )
  })

  it('returns top 5 sorted by magnitude desc', async () => {
    const features = [
      makeFeature(8.1),
      makeFeature(9.2),
      makeFeature(8.9),
      makeFeature(8.7),
      makeFeature(8.3),
      makeFeature(9.0)
    ]

    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ features })
    })

    const result = await top5DangerousEarthquakes()

    expect(result).toHaveLength(5)
    expect(result.map((f) => f.properties.mag)).toEqual([9.2, 9.0, 8.9, 8.7, 8.3])

    const url = fetch.mock.calls[0][0]
    expect(url).toContain('minmagnitude=8')
    expect(url).toContain('starttime=1900-01-01')
    expect(url).toMatch(/endtime=\d{4}-\d{2}-\d{2}/)
  })
})
