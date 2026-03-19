export function getMagnitudeStats(quakes) {
  let sum = 0;
  let max = -Infinity;
  let count = quakes.length;

  for (const quake of quakes) {
    const mag = quake.properties.mag;
    
    sum += mag;
    if (mag > max) max = mag;
  }

  const mean = Number((sum / count).toFixed(2));

  return { mean, max };
}