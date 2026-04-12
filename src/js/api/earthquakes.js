function getISODate(date = new Date()) {
  return date.toISOString().split('T')[0]
}

export async function getEarthquakes(lat, lon, radius) {
    const endtime = getISODate()

    const params = new URLSearchParams({
        format: 'geojson',
        latitude: lat,
        longitude: lon,
        maxradiuskm: radius,
        starttime: '1900-01-01',
        endtime
    })

  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?${params}`

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Error fetching earthquakes: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()

  return Array.isArray(data.features) ? data.features : []
}

export async function top5DangerousEarthquakes() {
  const endtime = getISODate()
  const params = new URLSearchParams({
        format: 'geojson',
        minmagnitude: 8,
        starttime: '1900-01-01',
        endtime
    })

  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?${params}`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Error fetching earthquakes: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()

  const top5 = (Array.isArray(data.features) ? data.features : [])
  .sort((a, b) => b.properties.mag - a.properties.mag)
  .slice(0, 5)

  return top5
}