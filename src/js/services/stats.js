export function getMagnitudeStats(quakes) {
  const validQuakes = quakes.filter(q => typeof q.properties.mag === 'number');

  if (validQuakes.length === 0) {
    return { mean: '-', max: '-', maxEvent: null };
  }

  const mags = validQuakes.map(q => q.properties.mag);
  const sum = mags.reduce((acc, m) => acc + m, 0);
  const mean = Number((sum / mags.length).toFixed(2));

  const maxEvent = validQuakes.reduce((maxQ, currentQ) => {
    return currentQ.properties.mag > maxQ.properties.mag ? currentQ : maxQ;
  });

  const max = maxEvent.properties.mag;

  return {
    mean,
    max,
    maxEvent 
  };
}
