import { getMagnitudeStats, averageTimeBetween, earthquakeProbabilityTable, last5Earthquakes } from '../services/stats.js'
import { paintChart, depthDistribution } from './charts.js'
import { buildMaxEventText, formatDate } from '../utils/helpers.js'

export function renderMainData(quakes) {
  const table = document.getElementById('top-5-earthquakes');
  table.innerHTML = `
    <tr>
      <th>Fecha</th>
      <th>Magnitud (MB)</th>
      <th>Profundidad</th>
      <th>Lugar</th>
      <th>Más informaciópn</th>
    </tr>
    ${quakes.map(row => `
      <tr>
        <td>${formatDate(row.properties.time)}</td>
        <td>${row.properties.mag}</td>
        <td>${row.geometry.coordinates[2]}km</td>
        <td>${row.properties.place}</td>
        <td>${row.properties.url}</td>
      </tr>
    `).join('')}
  `;
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
  document.getElementById('total-earthquakes').innerHTML = count
}

function renderMean(mean) {
  document.getElementById('mean-magnitude').innerHTML = mean
}

function renderMaxEvent(event) {
  document.getElementById('event-max-magnitude').innerHTML =
    buildMaxEventText(event)
}

function renderAverageTime(quakes) {
  document.getElementById('average-time-between').innerHTML =
    averageTimeBetween(quakes) + ' días'
}

function renderDepth(quakes) {
  document.getElementById('max-event-depth-distribution').innerHTML =
    depthDistribution(quakes)
}

function renderProbabilityTable(data) {
  const table = document.getElementById('probability-table');

  table.innerHTML = `
    <tr>
      <th>Magnitud</th>
      <th>Eventos</th>
      <th>Probabilidad (1 año)</th>
      <th>Riesgo</th>
    </tr>
    ${data.map(row => `
      <tr>
        <td>≥ ${row.minMagnitude}</td>
        <td>${row.events}</td>
        <td>${row.percentage}%</td>
        <td>${row.risk}</td>
      </tr>
    `).join('')}
  `;
}

function renderLastQuakes(lastQuakes) {
  const table = document.getElementById('last-earthquakes');
  table.innerHTML = `
    <tr>
      <th>Fecha</th>
      <th>Magnitud (MB)</th>
      <th>Profundidad</th>
      <th>Lugar</th>
      <th>Más informaciópn</th>
    </tr>
    ${lastQuakes.map(row => `
      <tr>
        <td>${formatDate(row.properties.time)}</td>
        <td>${row.properties.mag}</td>
        <td>${row.geometry.coordinates[2]}km</td>
        <td>${row.properties.place}</td>
        <td>${row.properties.url}</td>
      </tr>
    `).join('')}
  `;
}

export function renderNoResults() {
  console.log('No hay terremotos para esta búsqueda')
}

export function showLoading() {
  document.getElementById('loading').classList.remove('hidden')
}

export function hideLoading() {
  document.getElementById('loading').classList.add('hidden')
}