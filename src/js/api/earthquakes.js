const today = new Date()
let formatted = today.toISOString().split('T')[0]

export async function getEarthquakes(lat, lon, radius) {

    const params = new URLSearchParams({
        format: 'geojson',
        latitude: lat,
        longitude: lon,
        maxradiuskm: radius,
        starttime: '1900-01-01',
        endtime: formatted
    })

  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?${params}`

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Error fetching earthquakes: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()

  return data.features
}

export async function top5DangeorusEarthqueakes() {
  const params = new URLSearchParams({
        format: 'geojson',
        minmagnitude: 8,
        starttime: '1900-01-01',
        endtime: formatted
    })

  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?${params}`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Error fetching earthquakes: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()

  const top5 = data.features
  .sort((a, b) => b.properties.mag - a.properties.mag)
  .slice(0, 5)

  return top5
}