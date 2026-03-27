import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getCoordinates } from './geocoding.js'

describe('getCoordinates', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('throws when city is empty and does not call fetch', async () => {
    await expect(getCoordinates('   ')).rejects.toThrow('Debes introducir una ciudad valida.')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('throws when geocoding request fails', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests'
    })

    await expect(getCoordinates('Madrid')).rejects.toThrow(
      'Error al geocodificar la ciudad: 429 Too Many Requests'
    )
  })

  it('throws when response has no results', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => []
    })

    await expect(getCoordinates('CiudadInexistente')).rejects.toThrow(
      'No se han encontrado coordenadas para esa ciudad.'
    )
  })

  it('returns numeric coordinates when response is valid', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          lat: '40.4168',
          lon: '-3.7038'
        }
      ]
    })

    const result = await getCoordinates('Madrid')

    expect(result).toEqual({ lat: 40.4168, lon: -3.7038 })
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toContain('https://nominatim.openstreetmap.org/search?')
    expect(fetch.mock.calls[0][0]).toContain('q=Madrid')
    expect(fetch.mock.calls[0][0]).toContain('limit=1')
  })
})
