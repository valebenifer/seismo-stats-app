import './styles/style.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { getCoordinates } from './js/api/geocoding.js'
import { getEarthquakes } from './js/api/earthquakes.js'
import { renderAll, renderNoResults } from './js/ui/render.js'
import { getCityInput, getRadiusInput } from './js/utils/helpers.js'
import { showLoading, hideLoading } from './js/ui/render.js'

document.getElementById('searchBtn').addEventListener('click', async () => {
  try {
    showLoading()

    const city = getCityInput()
    const radius = getRadiusInput()

    const { lat, lon } = await getCoordinates(city)
    const quakes = await getEarthquakes(lat, lon, radius)

    if (quakes.length > 0) {
      renderAll(quakes)
      console.log(quakes)
    } else {
      renderNoResults()
    }

  } catch (error) {
    console.error(error)
  } finally {
    hideLoading()
  }
})
