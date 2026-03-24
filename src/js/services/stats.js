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

export function averageTimeBetween(quakes) {
  if (quakes.length < 2) return 0;

  const sorted = [...quakes].sort(
    (a, b) => b.properties.time - a.properties.time
  );

  const timeBetween = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const diffMs =
      sorted[i].properties.time - sorted[i + 1].properties.time;

    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    timeBetween.push(diffDays);
  }

  const sum = timeBetween.reduce((acc, num) => acc + num, 0);
  const average = sum / timeBetween.length;

  return Number(average.toFixed(2));
}
