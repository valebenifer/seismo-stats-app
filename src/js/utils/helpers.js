export function formatDate(timestamp) {
  const date = new Date(timestamp)

  return `${date.getFullYear()}/${
    String(date.getMonth() + 1).padStart(2, '0')
  }/${
    String(date.getDate()).padStart(2, '0')
  }`
}

export function buildMaxEventText(event) {
  if (!event || !event.properties || !event.geometry) {
    return '-'
  }

  return `${formatDate(event.properties.time)} 
  - Magnitud ${event.properties.mag} 
  - ${event.geometry.coordinates[2]}km de profundidad
  - ${event.properties.place}`
}

export function getCityInput() {
  return document.getElementById('cityInput').value.trim()
}

export function getRadiusInput() {
  return document.getElementById('maxRadius').value
}