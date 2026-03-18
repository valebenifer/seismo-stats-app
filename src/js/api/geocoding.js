export async function getCoordinates(city) {
    const API_KEY = '730bbb45ca95474d89168dc9ee3e20cc';

    const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${API_KEY}`);

    const data = await res.json();

    return {
        lat: data.results[0].geometry.lat,
        lon: data.results[0].geometry.lng
    }
}