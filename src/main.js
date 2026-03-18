import './styles/style.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { getCoordinates } from './js/api/geocoding.js'
import { getEarthquakes } from './js/api/earthquakes.js'

document.getElementById('searchBtn').addEventListener('click', async () => {
  const city = document.getElementById('cityInput').value
  
  const { lat, lon } = await getCoordinates(city)
  const quakes = await getEarthquakes(lat, lon)
  
  console.log(quakes)

  const results = document.getElementById('dataSpan')

  results.innerHTML = quakes
    .slice(0, 5)
    .map(q => `<p>${q.properties.mag}</p>`)
    .join('')
})
