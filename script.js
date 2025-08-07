// --- Data for our Life Cycle Assessment ---
const lcaData = { /* ... (data is unchanged) ... */
    material: { conventional: { water: 2700, carbon: 5.8 }, organic: { water: 950, carbon: 3.2 }, polyester: { water: 50, carbon: 8.5 }, blend: { water: 1400, carbon: 7.2 } },
    manufacturing: { china: { water: 150, carbon: 3.1 }, usa: { water: 120, carbon: 2.0 }, india: { water: 160, carbon: 2.9 }, eu: { water: 100, carbon: 1.5 }, brazil: { water: 90, carbon: 0.8 } },
    distribution: { sea: { water: 5, carbon: 0.2 }, air: { water: 10, carbon: 4.5 } },
    use_phase: { 'hot-machine': { water: 8, carbon: 0.05 }, 'cold-line': { water: 5, carbon: 0.006 } },
    end_of_life: { landfill: { water: 5, carbon: 1.2 }, recycle: { water: 50, carbon: -0.5 }, incinerate: { water: 5, carbon: 2.8 } }
};

// --- Get references to ALL our HTML elements ---
const materialChoice = document.getElementById('material-choice');
const manufacturingChoice = document.getElementById('manufacturing-choice');
const distributionChoice = document.getElementById('distribution-choice');
const usePhaseChoice = document.getElementById('use-phase-choice');
const washCountSlider = document.getElementById('wash-count-slider');
const endOfLifeChoice = document.getElementById('end-of-life-choice');
const resetButton = document.getElementById('reset-button');
const washCountDisplay = document.getElementById('wash-count-display');
const waterResultEl = document.getElementById('water-result');
const carbonResultEl = document.getElementById('carbon-result');
const waterEquivalencyEl = document.getElementById('water-equivalency');
const carbonEquivalencyEl = document.getElementById('carbon-equivalency');

// --- Chart Initialization ---
const doughnutChartLabels = ['Material', 'Manufacturing', 'Distribution', 'Use Phase', 'End-of-Life'];
const doughnutChartColors = ['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffa600'];

const createDoughnutChart = (canvasId, chartLabel) => { /* ... (function is unchanged) ... */
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, { type: 'doughnut', data: { labels: doughnutChartLabels, datasets: [{ label: chartLabel, data: [0,0,0,0,0], backgroundColor: doughnutChartColors, borderColor: '#ffffff', borderWidth: 2 }] }, options: { responsive: true, plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw.toFixed(1)}` } } } } });
};

// NEW: Helper function to create line charts
const createLineChart = (canvasId, yAxisLabel, lineColor) => {
    const ctx = document.getElementById(canvasId).getContext('2d');
    // Generate labels for the x-axis (1 to 200)
    const lineChartLabels = Array.from({ length: 200 }, (_, i) => i + 1);

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: lineChartLabels,
            datasets: [{
                label: yAxisLabel,
                data: [], // Will be populated dynamically
                borderColor: lineColor,
                backgroundColor: lineColor,
                tension: 0.1,
                pointRadius: [], // To highlight the selected point
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { x: { title: { display: true, text: 'Number of Washes' } }, y: { title: { display: true, text: yAxisLabel } } }
        }
    });
};

// Create all four charts
let waterChart = createDoughnutChart('waterChart', 'Water Usage (L)');
let carbonChart = createDoughnutChart('carbonChart', 'Carbon Footprint (kg CO2e)');
let waterLineChart = createLineChart('waterLineChart', 'Cumulative Water (L)', '#75b3d3');
let carbonLineChart = createLineChart('carbonLineChart', 'Cumulative Carbon (kg CO2e)', '#ff6361');


// --- Main Calculation Function ---
function calculateAndDisplayLCA() { /* ... (function logic is unchanged) ... */
    const material = lcaData.material[materialChoice.value];
    const manufacturing = lcaData.manufacturing[manufacturingChoice.value];
    const distribution = lcaData.distribution[distributionChoice.value];
    const end_of_life = lcaData.end_of_life[endOfLifeChoice.value];
    const washCount = parseInt(washCountSlider.value);
    const usePhasePerWash = lcaData.use_phase[usePhaseChoice.value];
    const use_phase = { water: usePhasePerWash.water * washCount, carbon: usePhasePerWash.carbon * washCount };
    const totalWater = material.water + manufacturing.water + distribution.water + use_phase.water + end_of_life.water;
    const totalCarbon = material.carbon + manufacturing.carbon + distribution.carbon + use_phase.carbon + end_of_life.carbon;
    waterResultEl.innerText = totalWater.toFixed(0);
    carbonResultEl.innerText = totalCarbon.toFixed(1);
    updateDoughnutCharts(material, manufacturing, distribution, use_phase, end_of_life);
    updateEquivalencies(totalWater, totalCarbon);
    updateLineCharts(); // NEW: Call the line chart update function
}

// --- Update Functions ---
function updateDoughnutCharts(material, manufacturing, distribution, use_phase, end_of_life) { /* ... (renamed from updateCharts) ... */
    waterChart.data.datasets[0].data = [material.water, manufacturing.water, distribution.water, use_phase.water, end_of_life.water];
    waterChart.update();
    carbonChart.data.datasets[0].data = [material.carbon, manufacturing.carbon, distribution.carbon, use_phase.carbon, end_of_life.carbon];
    carbonChart.update();
}

function updateEquivalencies(totalWater, totalCarbon) { /* ... (function is unchanged) ... */
    const yearsOfDrinkingWater = totalWater / (2.5 * 365);
    waterEquivalencyEl.innerText = `💧 Water to provide one person with drinking water for ${yearsOfDrinkingWater.toFixed(1)} years.`;
    const milesDriven = totalCarbon / 0.4;
    carbonEquivalencyEl.innerText = `💨 Carbon emissions from driving a car for ${milesDriven.toFixed(0)} miles.`;
}

// NEW: Function to update the line charts
function updateLineCharts() {
    const usePhasePerWash = lcaData.use_phase[usePhaseChoice.value];
    const maxWashes = 200;
    
    const cumulativeWaterData = [];
    const cumulativeCarbonData = [];

    // Generate cumulative data for 200 washes
    for (let i = 1; i <= maxWashes; i++) {
        cumulativeWaterData.push(usePhasePerWash.water * i);
        cumulativeCarbonData.push(usePhasePerWash.carbon * i);
    }
    
    // Update the line chart datasets
    waterLineChart.data.datasets[0].data = cumulativeWaterData;
    carbonLineChart.data.datasets[0].data = cumulativeCarbonData;
    
    // Create an array to set the radius of each point on the line chart
    const currentWashCount = parseInt(washCountSlider.value);
    const pointRadii = Array(maxWashes).fill(0); // Set all points to be invisible
    pointRadii[currentWashCount - 1] = 5; // Make the selected point a large, visible circle
    
    // Apply the highlight
    waterLineChart.data.datasets[0].pointRadius = pointRadii;
    carbonLineChart.data.datasets[0].pointRadius = pointRadii;

    // Redraw the charts
    waterLineChart.update();
    carbonLineChart.update();
}


// --- Event Listeners ---
const allChoices = [materialChoice, manufacturingChoice, distributionChoice, usePhaseChoice, endOfLifeChoice];
allChoices.forEach(choice => choice.addEventListener('change', calculateAndDisplayLCA));

washCountSlider.addEventListener('input', () => {
    washCountDisplay.innerText = `${washCountSlider.value} washes`;
    calculateAndDisplayLCA();
});

resetButton.addEventListener('click', () => { /* ... (function is unchanged) ... */
    materialChoice.value = 'conventional';
    manufacturingChoice.value = 'china';
    distributionChoice.value = 'sea';
    usePhaseChoice.value = 'hot-machine';
    endOfLifeChoice.value = 'landfill';
    washCountSlider.value = 50;
    washCountDisplay.innerText = `${washCountSlider.value} washes`;
    calculateAndDisplayLCA();
});

// --- Initial Calculation on page load ---
document.addEventListener('DOMContentLoaded', () => {
    washCountDisplay.innerText = `${washCountSlider.value} washes`;
    calculateAndDisplayLCA();
});
