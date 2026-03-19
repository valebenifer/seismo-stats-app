import './styles/style.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { getCoordinates } from './js/api/geocoding.js'
import { getEarthquakes } from './js/api/earthquakes.js'
import { getMagnitudeStats } from './js/services/stats.js'

document.getElementById('searchBtn').addEventListener('click', async () => {
  const city = document.getElementById('cityInput').value
  const radius = document.getElementById('maxRadius').value

  const { lat, lon } = await getCoordinates(city)
  const quakes = await getEarthquakes(lat, lon, radius)
  
  console.log(quakes)


  const totalEarthquakes = document.getElementById('total-earthquakes');
  totalEarthquakes.innerHTML = quakes.length;

  const { mean, max } = getMagnitudeStats(quakes);
  document.getElementById('mean-magnitude').innerHTML = mean;
  document.getElementById('max-magnitude').innerHTML = max;

})
