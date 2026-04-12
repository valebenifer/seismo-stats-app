import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../services/stats.js', () => ({
  getMagnitudeStats: vi.fn(() => ({
    mean: 5.4,
    maxEvent: {
      properties: {
        mag: 6.2,
        time: Date.UTC(2024, 0, 1),
        place: 'Test City',
        url: 'https://example.com/max'
      },
      geometry: {
        coordinates: [0, 0, 14]
      }
    }
  })),
  averageTimeBetween: vi.fn(() => 12),
  earthquakeProbabilityTable: vi.fn(() => [
    { minMagnitude: 5, events: 3, percentage: 80, risk: 'Alto' }
  ]),
  last5Earthquakes: vi.fn((quakes) => quakes.slice(0, 5))
}))

vi.mock('./charts.js', () => ({
  paintChart: vi.fn(),
  depthDistribution: vi.fn(() => ({
    properties: {
      mag: 5.8,
      time: Date.UTC(2024, 0, 2),
      place: 'Depth City',
      url: 'https://example.com/depth'
    },
    geometry: {
      coordinates: [0, 0, 22]
    }
  }))
}))

vi.mock('../utils/helpers.js', () => ({
  buildMaxEventText: vi.fn(() => '-'),
  formatDate: vi.fn(() => '2024/01/01')
}))

function createFakeElement(tagName = 'div') {
  const element = {
    tagName,
    children: [],
    className: '',
    href: '',
    target: '',
    rel: '',
    _textContent: '',
    classList: {
      values: new Set(),
      add(...tokens) {
        tokens.forEach((token) => this.values.add(token))
      },
      remove(...tokens) {
        tokens.forEach((token) => this.values.delete(token))
      },
      contains(token) {
        return this.values.has(token)
      }
    },
    appendChild(child) {
      this.children.push(child)
      return child
    },
    append(...nodes) {
      nodes.forEach((node) => {
        this.children.push(node)
      })
    },
    removeChild(child) {
      const index = this.children.indexOf(child)
      if (index >= 0) {
        this.children.splice(index, 1)
      }
      return child
    }
  }

  Object.defineProperty(element, 'firstChild', {
    get() {
      return this.children[0] ?? null
    }
  })

  Object.defineProperty(element, 'textContent', {
    get() {
      return this._textContent
    },
    set(value) {
      this._textContent = value
      this.children = []
    }
  })

  return element
}

function buildEarthquake(id) {
  return {
    id,
    properties: {
      mag: 5.1,
      time: Date.UTC(2024, 0, 3),
      place: `Place ${id}`,
      url: `https://example.com/${id}`
    },
    geometry: {
      coordinates: [0, 0, 10]
    }
  }
}

describe('render search results behavior', () => {
  let elements
  let renderAll
  let renderNoResults

  beforeEach(async () => {
    elements = {
      'search-results': createFakeElement('section'),
      'global-history': createFakeElement('section'),
      'search-results-title': createFakeElement('h2'),
      'search-empty-state': createFakeElement('div'),
      'search-empty-state-message': createFakeElement('p'),
      'total-earthquakes': createFakeElement('p'),
      'mean-magnitude': createFakeElement('p'),
      'event-max-magnitude': createFakeElement('div'),
      'average-time-between': createFakeElement('p'),
      'max-event-depth-distribution': createFakeElement('div'),
      'probability-table': createFakeElement('table'),
      'last-earthquakes': createFakeElement('div'),
      'top-5-earthquakes': createFakeElement('div')
    }

    elements['search-results'].classList.add('hidden')
    elements['search-empty-state'].classList.add('hidden')

    vi.stubGlobal('document', {
      getElementById: vi.fn((id) => elements[id] ?? null),
      createElement: vi.fn((tagName) => createFakeElement(tagName))
    })

    ;({ renderAll, renderNoResults } = await import('./render.js'))
  })

  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it('shows search results after rendering data', () => {
    renderAll([buildEarthquake('q1'), buildEarthquake('q2')])

    expect(elements['search-results'].classList.contains('hidden')).toBe(false)
  })

  it('shows empty state when there are no results', () => {
    renderNoResults('Sin resultados')

    expect(elements['global-history'].classList.contains('hidden')).toBe(true)
    expect(elements['search-results'].classList.contains('results-panel--empty')).toBe(true)
    expect(elements['search-empty-state'].classList.contains('hidden')).toBe(false)
    expect(elements['search-empty-state-message'].textContent).toBe('Sin resultados')
  })
})