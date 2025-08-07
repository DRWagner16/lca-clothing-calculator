// --- Data for our Life Cycle Assessment ---
const lcaData = {
    material: {
        conventional: { water: 2700, carbon: 5.8 },
        organic: { water: 950, carbon: 3.2 },
        polyester: { water: 50, carbon: 8.5 },
        blend: { water: 1400, carbon: 7.2 }
    },
    manufacturing: {
        china: { water: 150, carbon: 3.1 },
        usa: { water: 120, carbon: 2.0 },
        india: { water: 160, carbon: 2.9 },
        eu: { water: 100, carbon: 1.5 },
        brazil: { water: 90, carbon: 0.8 }
    },
    // NEW: Distribution data
    distribution: {
        sea: { water: 5, carbon: 0.2 },  // Very low impact
        air: { water: 10, carbon: 4.5 } // Very high carbon impact for speed
    },
    use_phase: {
        'hot-machine': { water: 400, carbon: 2.5 },
        'cold-line': { water: 250, carbon: 0.3 }
    }
};

// --- Get references to our HTML elements ---
const materialChoice = document.getElementById('material-choice');
const manufacturingChoice = document.getElementById('manufacturing-choice');
const distributionChoice = document.getElementById('distribution-choice'); // New
const usePhaseChoice = document.getElementById('use-phase-choice');

const waterResultEl = document.getElementById('water-result');
const carbonResultEl = document.getElementById('carbon-result');

// --- Chart Initialization ---
const chartLabels = ['Material', 'Manufacturing', 'Distribution', 'Use Phase'];
const chartColors = ['#003f5c', '#7a5195', '#ef5675', '#ffa600'];

// Function to create a new chart
const createChart = (canvasId, chartLabel) => {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: chartLabels,
            datasets: [{
                label: chartLabel,
                data: [0, 0, 0, 0], // Start with zero data
                backgroundColor: chartColors,
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw.toFixed(1)}` } }
            }
        }
    });
};

// Create the two charts
let waterChart = createChart('waterChart', 'Water Usage (L)');
let carbonChart = createChart('carbonChart', 'Carbon Footprint (kg CO2e)');

// --- Main Calculation and Chart Update Function ---
function calculateAndDisplayLCA() {
    // 1. Get the current user choices
    const material = lcaData.material[materialChoice.value];
    const manufacturing = lcaData.manufacturing[manufacturingChoice.value];
    const distribution = lcaData.distribution[distributionChoice.value];
    const use_phase = lcaData.use_phase[usePhaseChoice.value];

    // 2. Calculate totals
    const totalWater = material.water + manufacturing.water + distribution.water + use_phase.water;
    const totalCarbon = material.carbon + manufacturing.carbon + distribution.carbon + use_phase.carbon;

    // 3. Update the total number displays
    waterResultEl.innerText = totalWater.toFixed(0);
    carbonResultEl.innerText = totalCarbon.toFixed(1);
    
    // 4. Update the charts with the breakdown of impacts
    updateCharts(material, manufacturing, distribution, use_phase);
}

// --- NEW: Function to update chart data ---
function updateCharts(material, manufacturing, distribution, use_phase) {
    // Update water chart data
    waterChart.data.datasets[0].data = [
        material.water,
        manufacturing.water,
        distribution.water,
        use_phase.water
    ];
    waterChart.update();

    // Update carbon chart data
    carbonChart.data.datasets[0].data = [
        material.carbon,
        manufacturing.carbon,
        distribution.carbon,
        use_phase.carbon
    ];
    carbonChart.update();
}


// --- Event Listeners ---
materialChoice.addEventListener('change', calculateAndDisplayLCA);
manufacturingChoice.addEventListener('change', calculateAndDisplayLCA);
distributionChoice.addEventListener('change', calculateAndDisplayLCA);
usePhaseChoice.addEventListener('change', calculateAndDisplayLCA);

// --- Initial Calculation on page load ---
document.addEventListener('DOMContentLoaded', calculateAndDisplayLCA);
