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
    distribution: {
        sea: { water: 5, carbon: 0.2 },
        air: { water: 10, carbon: 4.5 }
    },
    // UPDATED: Use phase data is now PER WASH
    use_phase: {
        'hot-machine': { water: 8, carbon: 0.05 }, // Was 400L, 2.5kg for 50 washes
        'cold-line': { water: 5, carbon: 0.006 } // Was 250L, 0.3kg for 50 washes
    }
};

// --- Get references to our HTML elements ---
const materialChoice = document.getElementById('material-choice');
const manufacturingChoice = document.getElementById('manufacturing-choice');
const distributionChoice = document.getElementById('distribution-choice');
const usePhaseChoice = document.getElementById('use-phase-choice');
const washCountSlider = document.getElementById('wash-count-slider'); // New
const washCountDisplay = document.getElementById('wash-count-display'); // New

const waterResultEl = document.getElementById('water-result');
const carbonResultEl = document.getElementById('carbon-result');

// --- Chart Initialization ---
const chartLabels = ['Material', 'Manufacturing', 'Distribution', 'Use Phase'];
const chartColors = ['#003f5c', '#7a5195', '#ef5675', '#ffa600'];

const createChart = (canvasId, chartLabel) => { /* ... (This function is unchanged) ... */
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: chartLabels,
            datasets: [{
                label: chartLabel,
                data: [0, 0, 0, 0],
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

let waterChart = createChart('waterChart', 'Water Usage (L)');
let carbonChart = createChart('carbonChart', 'Carbon Footprint (kg CO2e)');

// --- Main Calculation and Chart Update Function ---
function calculateAndDisplayLCA() {
    // 1. Get static choices
    const material = lcaData.material[materialChoice.value];
    const manufacturing = lcaData.manufacturing[manufacturingChoice.value];
    const distribution = lcaData.distribution[distributionChoice.value];
    
    // 2. Calculate dynamic use phase based on slider
    const washCount = parseInt(washCountSlider.value);
    const usePhasePerWash = lcaData.use_phase[usePhaseChoice.value];
    const use_phase = { // Create a temporary object for the total use phase impact
        water: usePhasePerWash.water * washCount,
        carbon: usePhasePerWash.carbon * washCount
    };

    // 3. Calculate totals
    const totalWater = material.water + manufacturing.water + distribution.water + use_phase.water;
    const totalCarbon = material.carbon + manufacturing.carbon + distribution.carbon + use_phase.carbon;

    // 4. Update the total number displays
    waterResultEl.innerText = totalWater.toFixed(0);
    carbonResultEl.innerText = totalCarbon.toFixed(1);
    
    // 5. Update the charts
    updateCharts(material, manufacturing, distribution, use_phase);
}

// --- Function to update chart data ---
function updateCharts(material, manufacturing, distribution, use_phase) { /* ... (This function is unchanged) ... */
    waterChart.data.datasets[0].data = [material.water, manufacturing.water, distribution.water, use_phase.water];
    waterChart.update();
    carbonChart.data.datasets[0].data = [material.carbon, manufacturing.carbon, distribution.carbon, use_phase.carbon];
    carbonChart.update();
}

// --- Event Listeners ---
materialChoice.addEventListener('change', calculateAndDisplayLCA);
manufacturingChoice.addEventListener('change', calculateAndDisplayLCA);
distributionChoice.addEventListener('change', calculateAndDisplayLCA);
usePhaseChoice.addEventListener('change', calculateAndDisplayLCA);

// NEW: Event listener for the slider
washCountSlider.addEventListener('input', () => {
    // Update the visual display next to the slider
    washCountDisplay.innerText = `${washCountSlider.value} washes`;
    // Recalculate everything
    calculateAndDisplayLCA();
});

// --- Initial Calculation on page load ---
document.addEventListener('DOMContentLoaded', () => {
    washCountDisplay.innerText = `${washCountSlider.value} washes`;
    calculateAndDisplayLCA();
});
