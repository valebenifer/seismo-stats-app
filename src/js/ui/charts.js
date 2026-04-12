import Chart from 'chart.js/auto'

const theme = {
    text: '#F5F5F5',
    muted: '#919599',
    accent: '#D84A4A',
    accentSoft: 'rgba(216, 74, 74, 0.22)',
    grid: 'rgba(145, 149, 153, 0.14)'
}

function buildBaseOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: theme.text
                }
            },
            tooltip: {
                backgroundColor: '#121212',
                titleColor: theme.text,
                bodyColor: theme.text,
                borderColor: theme.grid,
                borderWidth: 1
            }
        },
        scales: {
            x: {
                ticks: {
                    color: theme.muted
                },
                grid: {
                    color: theme.grid
                }
            },
            y: {
                ticks: {
                    color: theme.muted
                },
                grid: {
                    color: theme.grid
                }
            }
        }
    }
}

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
                    data: data.map(row => row.count),
                    backgroundColor: theme.accentSoft,
                    borderColor: theme.accent,
                    borderWidth: 1.5,
                    borderRadius: 10,
                    hoverBackgroundColor: theme.accent
                }
            ]
        },
        options: buildBaseOptions()
    });
}

export function depthDistribution(quakes) {
    const dataAxis = quakes
    .filter(quake => {
        const x = quake.geometry?.coordinates?.[2];
        return x !== 0 && x !== null && x !== undefined;
    })
    .map(quake => ({
        x: quake.geometry.coordinates[2],
        y: quake.properties.mag
    }));

    const canvas = document.getElementById('depth-distribution');

    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.destroy();
    }

    const data = {
        datasets: [{
            label: 'Magnitud por profundidad',
            data: dataAxis,
            backgroundColor: theme.accent,
            borderColor: theme.accent,
            pointRadius: 5,
            pointHoverRadius: 7
        }],
    };

    new Chart(canvas, {
        type: 'scatter',
        data: data,
        options: {
            ...buildBaseOptions(),
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Profundidad (km)',
                        color: theme.text
                    },
                    ticks: {
                        color: theme.muted
                    },
                    grid: {
                        color: theme.grid
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Magnitud',
                        color: theme.text
                    },
                    ticks: {
                        color: theme.muted
                    },
                    grid: {
                        color: theme.grid
                    }
                }
            }
        }
    });

    let maxMag = 0;
    let minProf = 11000;
    let selectedQuake = null;
    quakes.forEach(quake => {

        const mag = quake.properties.mag;
        const depth = quake.geometry.coordinates[2];

        if (depth == null || depth === 0 || mag == null) {
            return;
        }

        if (
            mag > maxMag ||
            (mag === maxMag && depth < minProf)
        ) {
            maxMag = mag;
            minProf = depth;
            selectedQuake = quake;
        }
        
    })

    return selectedQuake;
}
