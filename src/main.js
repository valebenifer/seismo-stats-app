import './styles/style.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { getCoordinates } from './js/api/geocoding.js'
import { getEarthquakes, top5DangerousEarthquakes } from './js/api/earthquakes.js'
import { renderAll, renderNoResults, renderMainData } from './js/ui/render.js'
import { getCityInput, getRadiusInput } from './js/utils/helpers.js'
import { showLoading, hideLoading } from './js/ui/render.js'

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const top5 = await top5DangerousEarthquakes()
    renderMainData(top5)
  } catch (error) {
    console.error('Error al cargar los datos iniciales:', error)
  }
})

document.getElementById('searchBtn').addEventListener('click', async () => {
  try {
    showLoading()

    const city = getCityInput()
    const radius = getRadiusInput()

    const { lat, lon } = await getCoordinates(city)
    const quakes = await getEarthquakes(lat, lon, radius)

    if (quakes.length > 0) {
      renderAll(quakes)
    } else {
      renderNoResults('No hay terremotos para esta búsqueda.')
    }

  } catch (error) {
    console.error(error)
    renderNoResults(error?.message || 'Ha ocurrido un error al procesar la búsqueda.')
  } finally {
    hideLoading()
  }
})
