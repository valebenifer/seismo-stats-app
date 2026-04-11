import { getMagnitudeStats, averageTimeBetween, earthquakeProbabilityTable, last5Earthquakes } from '../services/stats.js'
import { paintChart, depthDistribution } from './charts.js'
import { buildMaxEventText, formatDate } from '../utils/helpers.js'

export function renderMainData(quakes) {
  const container = document.getElementById('top-5-earthquakes')
  renderEarthquakeCards(container, quakes)
}

export function renderAll(quakes) {
  showSearchResults()
  renderTotal(quakes.length)

  const { mean, maxEvent } = getMagnitudeStats(quakes)

  renderMean(mean)
  renderMaxEvent(maxEvent)

  paintChart(quakes)

  renderAverageTime(quakes)
  renderDepth(quakes)

  const tableData = earthquakeProbabilityTable(quakes, 1)
  renderProbabilityTable(tableData)

  const lastQuakes = last5Earthquakes(quakes)
  renderLastQuakes(lastQuakes)

  scrollToSearchResultsTitle()
}

function renderTotal(count) {
  document.getElementById('total-earthquakes').textContent = String(count)
}

function renderMean(mean) {
  document.getElementById('mean-magnitude').textContent = String(mean)
}

function renderMaxEvent(event) {
  const container = document.getElementById('event-max-magnitude')
  clearElement(container)

  if (!event || !event.properties || !event.geometry) {
    container.textContent = buildMaxEventText(event)
    return
  }

  container.appendChild(buildCriticalEventCard(event))
}

function renderAverageTime(quakes) {
  document.getElementById('average-time-between').textContent =
    averageTimeBetween(quakes) + ' días'
}

function renderDepth(quakes) {
  const container = document.getElementById('max-event-depth-distribution')
  clearElement(container)

  const event = depthDistribution(quakes)

  if (!event || !event.properties || !event.geometry) {
    container.textContent = '-'
    return
  }

  container.appendChild(buildDepthEventCard(event))
}

function renderProbabilityTable(data) {
  const table = document.getElementById('probability-table')
  clearElement(table)

  const header = document.createElement('tr')
  ;['Magnitud', 'Eventos', 'Probabilidad (1 año)', 'Riesgo'].forEach((text) => {
    const th = document.createElement('th')
    th.textContent = text
    header.appendChild(th)
  })
  table.appendChild(header)

  data.forEach((row) => {
    const tr = document.createElement('tr')
    appendCell(tr, `≥ ${row.minMagnitude}`)
    appendCell(tr, String(row.events))
    appendCell(tr, `${row.percentage}%`)
    appendCell(tr, row.risk)
    table.appendChild(tr)
  })
}

function renderLastQuakes(lastQuakes) {
  const container = document.getElementById('last-earthquakes')
  renderRecentEarthquakeCards(container, lastQuakes)
}

export function renderNoResults(message = 'No hay terremotos para esta búsqueda.') {
  showSearchResults()
  renderTotal(0)
  renderMean('-')
  document.getElementById('event-max-magnitude').textContent = message
  document.getElementById('average-time-between').textContent = '-'
  document.getElementById('max-event-depth-distribution').textContent = '-'
  document.getElementById('probability-table').textContent = ''
  document.getElementById('last-earthquakes').textContent = ''

  scrollToSearchResultsTitle()
}

export function showLoading() {
  document.getElementById('loading').classList.remove('hidden')
}

export function hideLoading() {
  document.getElementById('loading').classList.add('hidden')
}

function showSearchResults() {
  document.getElementById('search-results').classList.remove('hidden')
}

function scrollToSearchResultsTitle() {
  const title = document.getElementById('search-results-title')

  if (!title || typeof title.scrollIntoView !== 'function') {
    return
  }

  title.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

function appendCell(row, text) {
  const td = document.createElement('td')
  td.textContent = text
  row.appendChild(td)
}

function appendUrlCell(row, url) {
  const td = document.createElement('td')
  if (!url) {
    td.textContent = '-'
    row.appendChild(td)
    return
  }
  const link = document.createElement('a')
  link.textContent = 'Ver'
  link.href = url
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  td.appendChild(link)
  row.appendChild(td)
}

function renderEarthquakesTable(table, earthquakes) {
  clearElement(table)

  const header = document.createElement('tr')
  ;['Fecha', 'Magnitud (MB)', 'Profundidad', 'Lugar', 'Más información'].forEach((text) => {
    const th = document.createElement('th')
    th.textContent = text
    header.appendChild(th)
  })
  table.appendChild(header)

  earthquakes.forEach((row) => {
    const tr = document.createElement('tr')
    appendCell(tr, formatDate(row.properties.time))
    appendCell(tr, String(row.properties.mag))
    appendCell(tr, `${row.geometry.coordinates[2]}km`)
    appendCell(tr, row.properties.place)
    appendUrlCell(tr, row.properties.url)
    table.appendChild(tr)
  })
}

function renderEarthquakeCards(container, earthquakes) {
  clearElement(container)

  earthquakes.forEach((row, index) => {
    const article = document.createElement('article')
    article.className = 'quake-item'

    const rank = document.createElement('span')
    rank.className = 'quake-item__rank'
    rank.textContent = `#${index + 1}`

    const header = document.createElement('div')
    header.className = 'quake-item__header'

    const magnitude = document.createElement('p')
    magnitude.className = 'quake-item__magnitude'
    magnitude.textContent = `Magnitud ${row.properties.mag ?? '-'}`

    const date = document.createElement('p')
    date.className = 'quake-item__date'
    date.textContent = formatDate(row.properties.time)

    header.append(magnitude, date)

    const place = document.createElement('p')
    place.className = 'quake-item__place'
    place.textContent = row.properties.place || 'Ubicación no disponible'

    const meta = document.createElement('div')
    meta.className = 'quake-item__meta'

    const depth = document.createElement('span')
    depth.textContent = `${row.geometry.coordinates[2]} km de profundidad`

    meta.appendChild(depth)

    const link = buildEarthquakeLink(row.properties.url)
    if (link) {
      meta.appendChild(link)
    }

    article.append(rank, header, place, meta)
    container.appendChild(article)
  })
}

function renderRecentEarthquakeCards(container, earthquakes) {
  clearElement(container)

  earthquakes.forEach((row, index) => {
    const article = document.createElement('article')
    article.className = 'recent-quake-card'

    const top = document.createElement('div')
    top.className = 'recent-quake-card__top'

    const badge = document.createElement('span')
    badge.className = 'recent-quake-card__badge'
    badge.textContent = `#${index + 1} reciente`

    const date = document.createElement('p')
    date.className = 'recent-quake-card__date'
    date.textContent = formatDate(row.properties.time)

    top.append(badge, date)

    const title = document.createElement('p')
    title.className = 'recent-quake-card__title'
    title.textContent = row.properties.place || 'Ubicación no disponible'

    const metrics = document.createElement('div')
    metrics.className = 'recent-quake-card__metrics'

    metrics.append(
      buildRecentMetric('Magnitud', String(row.properties.mag ?? '-')),
      buildRecentMetric('Profundidad', `${row.geometry.coordinates[2]} km`)
    )

    article.append(top, title, metrics)

    const link = buildEarthquakeLink(row.properties.url)
    if (link) {
      link.classList.add('recent-quake-card__link')
      article.appendChild(link)
    }

    container.appendChild(article)
  })
}

function buildRecentMetric(label, value) {
  const item = document.createElement('div')
  item.className = 'recent-quake-card__metric'

  const labelElement = document.createElement('span')
  labelElement.className = 'recent-quake-card__metric-label'
  labelElement.textContent = label

  const valueElement = document.createElement('p')
  valueElement.className = 'recent-quake-card__metric-value'
  valueElement.textContent = value

  item.append(labelElement, valueElement)
  return item
}

function buildEarthquakeLink(url) {
  if (!url) {
    return null
  }

  const link = document.createElement('a')
  link.textContent = 'Ver detalle'
  link.href = url
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  return link
}

function buildCriticalEventCard(event) {
  const article = document.createElement('article')
  article.className = 'critical-event'

  const body = document.createElement('div')
  body.className = 'critical-event__body'

  const highlight = document.createElement('div')
  highlight.className = 'critical-event__highlight'

  const magnitude = document.createElement('p')
  magnitude.className = 'critical-event__magnitude'
  magnitude.textContent = String(event.properties.mag ?? '-')

  highlight.appendChild(magnitude)

  const facts = document.createElement('div')
  facts.className = 'critical-event__facts'

  facts.append(
    buildCriticalEventFact('Fecha', formatDate(event.properties.time)),
    buildCriticalEventFact('Profundidad', `${event.geometry.coordinates[2]} km`),
    buildCriticalEventFact('Ubicación', event.properties.place || 'Ubicación no disponible')
  )

  const link = buildEarthquakeLink(event.properties.url)
  if (link) {
    link.classList.add('critical-event__link')
    facts.appendChild(link)
  }

  body.append(highlight, facts)
  article.appendChild(body)

  return article
}

function buildCriticalEventFact(label, value) {
  const item = document.createElement('div')
  item.className = 'critical-event__fact'

  const labelElement = document.createElement('span')
  labelElement.className = 'critical-event__fact-label'
  labelElement.textContent = label

  const valueElement = document.createElement('p')
  valueElement.className = 'critical-event__fact-value'
  valueElement.textContent = value

  item.append(labelElement, valueElement)
  return item
}

function buildDepthEventCard(event) {
  const article = document.createElement('article')
  article.className = 'critical-event critical-event--depth'

  const top = document.createElement('div')
  top.className = 'critical-event__depth-top'

  const main = document.createElement('div')
  main.className = 'critical-event__depth-main'

  const eyebrow = document.createElement('span')
  eyebrow.className = 'critical-event__eyebrow'
  eyebrow.textContent = 'Referencia principal'

  const depthValue = document.createElement('p')
  depthValue.className = 'critical-event__depth-value'
  depthValue.textContent = `${event.geometry.coordinates[2]} km`

  const summary = document.createElement('p')
  summary.className = 'critical-event__summary'
  summary.textContent = 'Profundidad del sismo con mayor magnitud dentro de la distribución actual.'

  const magnitude = document.createElement('span')
  magnitude.className = 'critical-event__depth-badge'
  magnitude.textContent = `Magnitud M ${event.properties.mag ?? '-'}`

  main.append(eyebrow, depthValue, summary, magnitude)

  top.appendChild(main)

  const link = buildEarthquakeLink(event.properties.url)
  if (link) {
    link.classList.add('critical-event__link', 'critical-event__link--depth')
    top.appendChild(link)
  }

  const facts = document.createElement('div')
  facts.className = 'critical-event__depth-facts'

  facts.append(
    buildCriticalEventFact('Fecha', formatDate(event.properties.time)),
    buildCriticalEventFact('Ubicación', event.properties.place || 'Ubicación no disponible')
  )

  article.append(top, facts)

  return article
}