import Chart from 'chart.js/auto'

export function paintChart(quakes) {
    const counts = {};

    quakes.forEach(t => {
        const year = new Date(t.properties.time).getFullYear();
        counts[year] = (counts[year] || 0) + 1;
    });

    const data = Object.keys(counts).map(year => ({
        year: Number(year),
        count: counts[year]
    }));

    const canvas = document.getElementById('frequency-by-year');

    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.destroy();
    }

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: data.map(row => row.year),
            datasets: [
                {
                    label: 'Terremotos por año',
                    data: data.map(row => row.count)
                }
            ]
        }
    });
}
