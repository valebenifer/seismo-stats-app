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

export function earthquakeProbabilityTable(
  quakes,
  yearsAhead = 1,
  magnitudes = [4, 5, 6]
) {
  if (!quakes || quakes.length === 0) return [];

  const sorted = [...quakes].sort(
    (a, b) => a.properties.time - b.properties.time
  );

  const firstDate = sorted[0].properties.time;
  const lastDate = sorted[sorted.length - 1].properties.time;

  const totalYears =
    (lastDate - firstDate) / (1000 * 60 * 60 * 24 * 365);

  if (totalYears <= 0) return [];

  const getRisk = (probability) => {
    if (probability < 0.05) return "Muy bajo";
    if (probability < 0.15) return "Bajo";
    if (probability < 0.35) return "Moderado";
    if (probability < 0.65) return "Alto";
    return "Muy alto";
  };

  const results = magnitudes.map((minMagnitude) => {
    const filtered = quakes.filter(
      q => q.properties.mag >= minMagnitude
    );

    const events = filtered.length;

    if (events === 0) {
      return {
        minMagnitude,
        events: 0,
        lambda: 0,
        probability: 0,
        percentage: "0.00",
        risk: "Muy bajo"
      };
    }

    const lambda = events / totalYears;
    const probability = 1 - Math.exp(-lambda * yearsAhead);

    return {
      minMagnitude,
      events,
      lambda: lambda.toFixed(3),
      probability,
      percentage: (probability * 100).toFixed(2),
      risk: getRisk(probability)
    };
  });

  return results;
}

