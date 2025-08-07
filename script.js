// --- Data for our Life Cycle Assessment ---
const lcaData = {
    material: { /* ... (data unchanged) ... */ 
        conventional: { water: 2700, carbon: 5.8 },
        organic: { water: 950, carbon: 3.2 },
        polyester: { water: 50, carbon: 8.5 },
        blend: { water: 1400, carbon: 7.2 }
    },
    manufacturing: { /* ... (data unchanged) ... */
        china: { water: 150, carbon: 3.1 },
        usa: { water: 120, carbon: 2.0 },
        india: { water: 160, carbon: 2.9 },
        eu: { water: 100, carbon: 1.5 },
        brazil: { water: 90, carbon: 0.8 }
    },
    distribution: { /* ... (data unchanged) ... */
        sea: { water: 5, carbon: 0.2 },
        air: { water: 10, carbon: 4.5 }
    },
    use_phase: { /* ... (data unchanged) ... */
        'hot-machine': { water: 8, carbon: 0.05 },
        'cold-line': { water: 5, carbon: 0.006 }
    },
    // NEW: End-of-Life data
    end_of_life: {
        landfill: { water: 5, carbon: 1.2 },    // Methane emissions from decomposition
        recycle: { water: 50, carbon: -0.5 },   // Energy to recycle, but avoids new production (negative carbon)
        incinerate: { water: 5, carbon: 2.8 }   // CO2 emissions from burning
    }
};

// --- Get references to ALL our HTML elements ---
const materialChoice = document.getElementById('material-choice');
const manufacturingChoice = document.getElementById('manufacturing-choice');
const distributionChoice = document.getElementById('distribution-choice');
const usePhaseChoice = document.getElementById('use-phase-choice');
const washCountSlider = document.getElementById('wash-count-slider');
const endOfLifeChoice = document.getElementById('end-of-life-choice'); // New
const resetButton = document.getElementById('reset-button'); // New

const washCountDisplay = document.getElementById('wash-count-display');
const waterResultEl = document.getElementById('water-result');
const carbonResultEl = document.getElementById('carbon-result');
const waterEquivalencyEl = document.getElementById('water-equivalency'); // New
const carbonEquivalencyEl = document.getElementById('carbon-equivalency'); // New

// --- Chart Initialization (now with 5 stages) ---
const chartLabels = ['Material', 'Manufacturing', 'Distribution', 'Use Phase', 'End-of-Life']; // Updated
const chartColors = ['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffa600']; // Updated

const createChart = (canvasId, chartLabel) => { /* ... (This function is unchanged) ... */
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, { type: 'doughnut', data: { labels: chartLabels, datasets: [{ label: chartLabel, data: [0,0,0,0,0], backgroundColor: chartColors, borderColor: '#ffffff', borderWidth: 2 }] }, options: { responsive: true, plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw.toFixed(1)}` } } } } });
};

let waterChart = createChart('waterChart', 'Water Usage (L)');
let carbonChart = createChart('carbonChart', 'Carbon Footprint (kg CO2e)');

// --- Main Calculation Function ---
function calculateAndDisplayLCA() {
    // 1. Get static choices
    const material = lcaData.material[materialChoice.value];
    const manufacturing = lcaData.manufacturing[manufacturingChoice.value];
    const distribution = lcaData.distribution[distributionChoice.value];
    const end_of_life = lcaData.end_of_life[endOfLifeChoice.value]; // New
    
    // 2. Calculate dynamic use phase
    const washCount = parseInt(washCountSlider.value);
    const usePhasePerWash = lcaData.use_phase[usePhaseChoice.value];
    const use_phase = {
        water: usePhasePerWash.water * washCount,
        carbon: usePhasePerWash.carbon * washCount
    };

    // 3. Calculate totals (now with 5 stages)
    const totalWater = material.water + manufacturing.water + distribution.water + use_phase.water + end_of_life.water;
    const totalCarbon = material.carbon + manufacturing.carbon + distribution.carbon + use_phase.carbon + end_of_life.carbon;

    // 4. Update displays
    waterResultEl.innerText = totalWater.toFixed(0);
    carbonResultEl.innerText = totalCarbon.toFixed(1);
    
    // 5. Update charts and equivalencies
    updateCharts(material, manufacturing, distribution, use_phase, end_of_life);
    updateEquivalencies(totalWater, totalCarbon);
}

// --- Update Functions ---
function updateCharts(material, manufacturing, distribution, use_phase, end_of_life) {
    // Update chart data (now with 5 values)
    waterChart.data.datasets[0].data = [material.water, manufacturing.water, distribution.water, use_phase.water, end_of_life.water];
    waterChart.update();
    carbonChart.data.datasets[0].data = [material.carbon, manufacturing.carbon, distribution.carbon, use_phase.carbon, end_of_life.carbon];
    carbonChart.update();
}

// NEW: Function to calculate and display equivalencies
function updateEquivalencies(totalWater, totalCarbon) {
    // Water: Assume 2.5 liters drinking water per day
    const yearsOfDrinkingWater = totalWater / (2.5 * 365);
    waterEquivalencyEl.innerText = `💧 Water to provide one person with drinking water for ${yearsOfDrinkingWater.toFixed(1)} years.`;
    
    // Carbon: Assume avg car emits 0.4 kg CO2e per mile
    const milesDriven = totalCarbon / 0.4;
    carbonEquivalencyEl.innerText = `💨 Carbon emissions from driving a car for ${milesDriven.toFixed(0)} miles.`;
}

// --- Event Listeners ---
materialChoice.addEventListener('change', calculateAndDisplayLCA);
manufacturingChoice.addEventListener('change', calculateAndDisplayLCA);
distributionChoice.addEventListener('change', calculateAndDaisplayLCA);
usePhaseChoice.addEventListener('change', calculateAndDisplayLCA);
endOfLifeChoice.addEventListener('change', calculateAndDisplayLCA); // New

washCountSlider.addEventListener('input', () => {
    washCountDisplay.innerText = `${washCountSlider.value} washes`;
    calculateAndDisplayLCA();
});

// NEW: Event listener for the reset button
resetButton.addEventListener('click', () => {
    // Set all inputs back to their first/default option
    materialChoice.value = 'conventional';
    manufacturingChoice.value = 'china';
    distributionChoice.value = 'sea';
    usePhaseChoice.value = 'hot-machine';
    endOfLifeChoice.value = 'landfill';
    washCountSlider.value = 50;
    
    // Update the slider display text
    washCountDisplay.innerText = `${washCountSlider.value} washes`;
    
    // Recalculate everything with the default values
    calculateAndDisplayLCA();
});

// --- Initial Calculation on page load ---
document.addEventListener('DOMContentLoaded', () => {
    washCountDisplay.innerText = `${washCountSlider.value} washes`;
    calculateAndDisplayLCA();
});
