import { getMagnitudeStats, averageTimeBetween, earthquakeProbabilityTable, last5Earthquakes } from '../services/stats.js'
import { paintChart, depthDistribution } from './charts.js'
import { buildMaxEventText, formatDate } from '../utils/helpers.js'

export function renderMainData(quakes) {
  const table = document.getElementById('top-5-earthquakes')
  renderEarthquakesTable(table, quakes)
}

export function renderAll(quakes) {
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
}

function renderTotal(count) {
  document.getElementById('total-earthquakes').textContent = String(count)
}

function renderMean(mean) {
  document.getElementById('mean-magnitude').textContent = String(mean)
}

function renderMaxEvent(event) {
  document.getElementById('event-max-magnitude').textContent =
    buildMaxEventText(event)
}

function renderAverageTime(quakes) {
  document.getElementById('average-time-between').textContent =
    averageTimeBetween(quakes) + ' días'
}

function renderDepth(quakes) {
  const depthText = depthDistribution(quakes)
  document.getElementById('max-event-depth-distribution').textContent = depthText || '-'
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
  const table = document.getElementById('last-earthquakes')
  renderEarthquakesTable(table, lastQuakes)
}

export function renderNoResults(message = 'No hay terremotos para esta búsqueda.') {
  renderTotal(0)
  renderMean('-')
  document.getElementById('event-max-magnitude').textContent = message
  document.getElementById('average-time-between').textContent = '-'
  document.getElementById('max-event-depth-distribution').textContent = '-'
  document.getElementById('probability-table').textContent = ''
  document.getElementById('last-earthquakes').textContent = ''
}

export function showLoading() {
  document.getElementById('loading').classList.remove('hidden')
}

export function hideLoading() {
  document.getElementById('loading').classList.add('hidden')
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