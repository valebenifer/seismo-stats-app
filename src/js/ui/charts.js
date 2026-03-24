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

export function depthDistribution(quakes) {
    const dataAxis = quakes.map(quake => {
        return {
            x: quake.geometry.coordinates[2],
            y: quake.properties.mag
        };
    });

    const canvas = document.getElementById('depth-distribution');

    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.destroy();
    }

    const data = {
        datasets: [{
            label: 'Scatter Dataset',
            data: dataAxis,
            backgroundColor: 'rgb(255, 99, 132)'
        }],
    };

    new Chart(canvas, {
        type: 'scatter',
        data: data,
        options: {
            scales: {
            x: {
                type: 'linear',
                position: 'bottom'
            }
            }
        }
    });

    let maxMag = 0;
    let minProf = 11000;
    let dataMaxEvent;
    quakes.forEach(quake => {

        if ((quake.geometry.coordinates[2] >= maxMag) && (quake.properties.mag <= minProf)) {
   
            maxMag = quake.geometry.coordinates[2];
            minProf = quake.properties.mag;

            const date = new Date(quake.properties.time);
            const formatted = `${date.getFullYear()}/${
            String(date.getMonth() + 1).padStart(2, '0')
            }/${
            String(date.getDate()).padStart(2, '0')
            }`;
            dataMaxEvent = formatted + ' - ' + ' Magnitud ' + quake.properties.mag + ' - ' + quake.properties.place;
            console.log(dataMaxEvent);
        }
        
    })

    return dataMaxEvent;
}
