export async function getEarthquakes(lat, lon, radius) {
    const today = new Date()
    const formatted = today.toISOString().split('T')[0]
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