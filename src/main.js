import './styles/style.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { getCoordinates } from './js/api/geocoding.js'
import { getEarthquakes } from './js/api/earthquakes.js'
import { getMagnitudeStats } from './js/services/stats.js'
import { paintChart } from './js/ui/charts.js'
import { averageTimeBetween } from './js/services/stats.js'
import { depthDistribution } from './js/ui/charts.js'

document.getElementById('searchBtn').addEventListener('click', async () => {
  const city = document.getElementById('cityInput').value
  const radius = document.getElementById('maxRadius').value

  const { lat, lon } = await getCoordinates(city)
  const quakes = await getEarthquakes(lat, lon, radius)
  
  console.log(quakes)

  if (quakes.length > 0) {
    const totalEarthquakes = document.getElementById('total-earthquakes');
    totalEarthquakes.innerHTML = quakes.length;

    const { mean, max, maxEvent } = getMagnitudeStats(quakes);
    document.getElementById('mean-magnitude').innerHTML = mean;
    document.getElementById('max-magnitude').innerHTML = max;

    const date = new Date(maxEvent.properties.time);
    const formatted = `${date.getFullYear()}/${
      String(date.getMonth() + 1).padStart(2, '0')
    }/${
      String(date.getDate()).padStart(2, '0')
    }`;
    const dataMaxEvent = formatted + ' - ' + ' Magnitud ' + maxEvent.properties.mag + ' - ' + maxEvent.properties.place;
    document.getElementById('event-max-magnitude').innerHTML = dataMaxEvent;

    paintChart(quakes);
    document.getElementById('average-time-between').innerHTML = averageTimeBetween(quakes) + ' días';

    document.getElementById('max-event-depth-distribution').innerHTML = depthDistribution(quakes);
  } else {
    console.log('No hay terremotos para esta búsqueda')
  }
})
