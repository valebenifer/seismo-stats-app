import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

const mockGetCoordinates = vi.fn()
const mockGetEarthquakes = vi.fn()
const mockTop5DangerousEarthquakes = vi.fn()
const mockRenderAll = vi.fn()
const mockRenderNoResults = vi.fn()
const mockRenderMainData = vi.fn()
const mockShowLoading = vi.fn()
const mockHideLoading = vi.fn()
const mockGetCityInput = vi.fn()
const mockGetRadiusInput = vi.fn()

vi.mock('./js/api/geocoding.js', () => ({
  getCoordinates: mockGetCoordinates
}))

vi.mock('./js/api/earthquakes.js', () => ({
  getEarthquakes: mockGetEarthquakes,
  top5DangerousEarthquakes: mockTop5DangerousEarthquakes
}))

vi.mock('./js/ui/render.js', () => ({
  renderAll: mockRenderAll,
  renderNoResults: mockRenderNoResults,
  renderMainData: mockRenderMainData,
  showLoading: mockShowLoading,
  hideLoading: mockHideLoading
}))

vi.mock('./js/utils/helpers.js', () => ({
  getCityInput: mockGetCityInput,
  getRadiusInput: mockGetRadiusInput
}))

function setupFakeDom() {
  let domContentLoadedHandler
  let searchClickHandler

  const searchBtn = {
    addEventListener: vi.fn((event, handler) => {
      if (event === 'click') {
        searchClickHandler = handler
      }
    })
  }

  vi.stubGlobal('window', {
    addEventListener: vi.fn((event, handler) => {
      if (event === 'DOMContentLoaded') {
        domContentLoadedHandler = handler
      }
    })
  })

  vi.stubGlobal('document', {
    getElementById: vi.fn((id) => {
      if (id === 'searchBtn') {
        return searchBtn
      }
      return null
    })
  })

  return {
    runDomContentLoaded: async () => {
      if (domContentLoadedHandler) {
        await domContentLoadedHandler()
      }
    },
    runSearchClick: async () => {
      if (searchClickHandler) {
        await searchClickHandler()
      }
    }
  }
}

describe('main integration flow', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('loads top 5 data on DOMContentLoaded', async () => {
    const fakeDom = setupFakeDom()
    const top5 = [{ id: 'quake-1' }]
    mockTop5DangerousEarthquakes.mockResolvedValue(top5)

    await import('./main.js')
    await fakeDom.runDomContentLoaded()

    expect(mockTop5DangerousEarthquakes).toHaveBeenCalledTimes(1)
    expect(mockRenderMainData).toHaveBeenCalledWith(top5)
  })

  it('executes successful search flow and renders all data', async () => {
    const fakeDom = setupFakeDom()
    mockGetCityInput.mockReturnValue('Madrid')
    mockGetRadiusInput.mockReturnValue('50')
    mockGetCoordinates.mockResolvedValue({ lat: 40.4168, lon: -3.7038 })
    const quakes = [{ id: 'q1' }]
    mockGetEarthquakes.mockResolvedValue(quakes)

    await import('./main.js')
    await fakeDom.runSearchClick()

    expect(mockShowLoading).toHaveBeenCalledTimes(1)
    expect(mockGetCoordinates).toHaveBeenCalledWith('Madrid')
    expect(mockGetEarthquakes).toHaveBeenCalledWith(40.4168, -3.7038, '50')
    expect(mockRenderAll).toHaveBeenCalledWith(quakes)
    expect(mockRenderNoResults).not.toHaveBeenCalled()
    expect(mockHideLoading).toHaveBeenCalledTimes(1)
  })

  it('renders no-results message when API returns empty list', async () => {
    const fakeDom = setupFakeDom()
    mockGetCityInput.mockReturnValue('Madrid')
    mockGetRadiusInput.mockReturnValue('50')
    mockGetCoordinates.mockResolvedValue({ lat: 40.4168, lon: -3.7038 })
    mockGetEarthquakes.mockResolvedValue([])

    await import('./main.js')
    await fakeDom.runSearchClick()

    expect(mockRenderNoResults).toHaveBeenCalledWith('No hay terremotos para esta búsqueda.')
    expect(mockRenderAll).not.toHaveBeenCalled()
    expect(mockHideLoading).toHaveBeenCalledTimes(1)
  })

  it('renders error message when search flow throws', async () => {
    const fakeDom = setupFakeDom()
    mockGetCityInput.mockReturnValue('Madrid')
    mockGetRadiusInput.mockReturnValue('50')
    mockGetCoordinates.mockRejectedValue(new Error('Fallo de geocodificacion'))
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await import('./main.js')
    await fakeDom.runSearchClick()

    expect(mockRenderNoResults).toHaveBeenCalledWith('Fallo de geocodificacion')
    expect(mockHideLoading).toHaveBeenCalledTimes(1)
    expect(consoleErrorSpy).toHaveBeenCalled()
  })
})
