export async function getCoordinates(city) {
    const normalizedCity = city?.trim();
    if (!normalizedCity) {
        throw new Error('Debes introducir una ciudad valida.');
    }

    const params = new URLSearchParams({
        q: normalizedCity,
        format: 'jsonv2',
        limit: '1'
    });

    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);

    if (!res.ok) {
        throw new Error(`Error al geocodificar la ciudad: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No se han encontrado coordenadas para esa ciudad.');
    }

    return {
        lat: Number(data[0].lat),
        lon: Number(data[0].lon)
    }
}