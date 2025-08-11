// --- Data for our Life Cycle Assessment ---
const lcaData = {
    material: { 
        conventional: { water: 2700, carbon: 5.8, sdgs: [6, 12, 15] },
        organic: { water: 950, carbon: 3.2, sdgs: [3, 6, 12, 15] },
        polyester: { water: 50, carbon: 8.5, sdgs: [7, 12, 13, 14] },
        blend: { water: 1400, carbon: 7.2, sdgs: [6, 7, 12, 15] }
    },
    manufacturing: {
        china: { water: 150, carbon: 3.1, urban: 'high local air pollution from concentrated industrial activity', sdgs: [8, 9, 11] },
        usa: { water: 120, carbon: 2.0, urban: 'moderate local air pollution due to mixed industrial and regulatory standards', sdgs: [8, 9] },
        india: { water: 160, carbon: 2.9, urban: 'high local air and water pollution from dense industrial zones', sdgs: [8, 9, 11] },
        eu: { water: 100, carbon: 1.5, urban: 'lower local air pollution due to stricter environmental regulations', sdgs: [8, 9, 12] },
        brazil: { water: 90, carbon: 0.8, urban: 'lower local air pollution, with primary impacts on land use from hydropower', sdgs: [7, 8, 9] }
    },
    distribution: { 
        sea: { water: 5, carbon: 0.2, urban: 'contributing to significant port traffic and related emissions', sdgs: [9, 11, 14] },
        air: { water: 10, carbon: 4.5, urban: 'requiring extensive truck traffic to and from airports, causing congestion', sdgs: [9, 11, 13] }
    },
    use_phase: {
        'hot-machine': { water: 8, carbon: 0.05, sdgs: [6, 7, 12] },
        'cold-line': { water: 5, carbon: 0.006, sdgs: [6, 7, 12] }
    },
    end_of_life: {
        landfill: { water: 5, carbon: 1.2, urban: 'significant truck traffic for waste hauling and potential for local ground pollution', sdgs: [11, 12] },
        recycle: { water: 50, carbon: -0.5, urban: 'moderate collection traffic but helps reduce the need for new industrial facilities', sdgs: [9, 11, 12] },
        incinerate: { water: 5, carbon: 2.8, urban: 'high truck traffic and the release of airborne particulates that affect local air quality', sdgs: [3, 11, 12] }
    }
};

// --- Get references to HTML elements ---
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
const urbanImpactTextEl = document.getElementById('urban-impact-text');

// --- Chart Initialization ---
const doughnutChartLabels = ['Material', 'Manufacturing', 'Distribution', 'Use Phase', 'End-of-Life'];
const doughnutChartColors = ['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffa600'];

const createDoughnutChart = (canvasId, chartLabel) => {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, { 
        type: 'doughnut', 
        data: { 
            labels: doughnutChartLabels, 
            datasets: [{ 
                label: chartLabel, 
                data: [0,0,0,0,0], 
                backgroundColor: doughnutChartColors, 
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

const createLineChart = (canvasId, yAxisLabel, lineColor) => {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const lineChartLabels = Array.from({ length: 200 }, (_, i) => i + 1);
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: lineChartLabels,
            datasets: [{
                label: yAxisLabel,
                data: [], 
                borderColor: lineColor,
                backgroundColor: lineColor,
                tension: 0.1,
                pointRadius: [],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { display: false } 
            },
            scales: { 
                x: { title: { display: true, text: 'Number of Washes' } }, 
                y: { title: { display: true, text: yAxisLabel } } 
            },
            layout: {
                padding: {
                    left: 10,
                    right: 20,
                    top: 10,
                    bottom: 10
                }
            }
        }
    });
};

let waterChart = createDoughnutChart('waterChart', 'Water Usage (L)');
let carbonChart = createDoughnutChart('carbonChart', 'Carbon Footprint (kg CO2e)');
let waterLineChart = createLineChart('waterLineChart', 'Cumulative Water (L)', '#75b3d3');
let carbonLineChart = createLineChart('carbonLineChart', 'Cumulative Carbon (kg CO2e)', '#ff6361');

// --- Main Calculation Function ---
function calculateAndDisplayLCA() {
    const material = lcaData.material[materialChoice.value];
    const manufacturing = lcaData.manufacturing[manufacturingChoice.value];
    const distribution = lcaData.distribution[distributionChoice.value];
    const end_of_life = lcaData.end_of_life[endOfLifeChoice.value];
    const usePhasePerWash = lcaData.use_phase[usePhaseChoice.value];
    
    displayStageSdgs('material-sdgs', material.sdgs);
    displayStageSdgs('manufacturing-sdgs', manufacturing.sdgs);
    displayStageSdgs('distribution-sdgs', distribution.sdgs);
    displayStageSdgs('use-phase-sdgs', usePhasePerWash.sdgs);
    displayStageSdgs('end-of-life-sdgs', end_of_life.sdgs);
    
    const washCount = parseInt(washCountSlider.value);
    const use_phase = { 
        water: usePhasePerWash.water * washCount, 
        carbon: usePhasePerWash.carbon * washCount,
    };
    const totalWater = material.water + manufacturing.water + distribution.water + use_phase.water + end_of_life.water;
    const totalCarbon = material.carbon + manufacturing.carbon + distribution.carbon + use_phase.carbon + end_of_life.carbon;

    waterResultEl.innerText = totalWater.toFixed(0);
    carbonResultEl.innerText = totalCarbon.toFixed(1);
    
    updateDoughnutCharts(material, manufacturing, distribution, use_phase, end_of_life);
    updateEquivalencies(totalWater, totalCarbon);
    updateUrbanImpact(manufacturing, distribution, end_of_life);
    updateLineCharts();
}

// --- Update Functions ---
function updateDoughnutCharts(material, manufacturing, distribution, use_phase, end_of_life) {
    waterChart.data.datasets[0].data = [material.water, manufacturing.water, distribution.water, use_phase.water, end_of_life.water];
    waterChart.update();
    carbonChart.data.datasets[0].data = [material.carbon, manufacturing.carbon, distribution.carbon, use_phase.carbon, end_of_life.carbon];
    carbonChart.update();
}

function updateEquivalencies(totalWater, totalCarbon) {
    const yearsOfDrinkingWater = totalWater / (2.5 * 365);
    waterEquivalencyEl.innerText = `💧 Water to provide one person with drinking water for ${yearsOfDrinkingWater.toFixed(1)} years.`;
    const milesDriven = totalCarbon / 0.4;
    carbonEquivalencyEl.innerText = `💨 Carbon emissions from driving a car for ${milesDriven.toFixed(0)} miles.`;
}

function updateUrbanImpact(manufacturing, distribution, end_of_life) {
    const impactText = `This scenario involves ${manufacturing.urban}, while distribution is ${distribution.urban}. Finally, its disposal results in ${end_of_life.urban}.`;
    urbanImpactTextEl.innerText = impactText;
}

function updateLineCharts() {
    const material = lcaData.material[materialChoice.value];
    const manufacturing = lcaData.manufacturing[manufacturingChoice.value];
    const distribution = lcaData.distribution[distributionChoice.value];
    const end_of_life = lcaData.end_of_life[endOfLifeChoice.value];
    const usePhasePerWash = lcaData.use_phase[usePhaseChoice.value];
    const fixedWaterImpact = material.water + manufacturing.water + distribution.water + end_of_life.water;
    const fixedCarbonImpact = material.carbon + manufacturing.carbon + distribution.carbon + end_of_life.carbon;
    const maxWashes = 200;
    const cumulativeTotalWaterData = [];
    const cumulativeTotalCarbonData = [];
    for (let i = 1; i <= maxWashes; i++) {
        cumulativeTotalWaterData.push(fixedWaterImpact + (usePhasePerWash.water * i));
        cumulativeTotalCarbonData.push(fixedCarbonImpact + (usePhasePerWash.carbon * i));
    }
    waterLineChart.data.datasets[0].data = cumulativeTotalWaterData;
    carbonLineChart.data.datasets[0].data = cumulativeTotalCarbonData;
    const currentWashCount = parseInt(washCountSlider.value);
    const pointRadii = Array(maxWashes).fill(0); 
    pointRadii[currentWashCount - 1] = 5; 
    waterLineChart.data.datasets[0].pointRadius = pointRadii;
    carbonLineChart.data.datasets[0].pointRadius = pointRadii;
    waterLineChart.update();
    carbonLineChart.update();
}

const sdgTitles = { 3: 'Good Health and Well-being', 6: 'Clean Water and Sanitation', 7: 'Affordable and Clean Energy', 8: 'Decent Work and Economic Growth', 9: 'Industry, Innovation and Infrastructure', 11: 'Sustainable Cities and Communities', 12: 'Responsible Consumption and Production', 13: 'Climate Action', 14: 'Life Below Water', 15: 'Life on Land' };

function displayStageSdgs(containerId, sdgNumbers = []) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; 

    sdgNumbers.forEach(sdgNum => {
        const img = document.createElement('img');
        const formattedNum = sdgNum.toString().padStart(2, '0');
        img.src = `https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-${formattedNum}.jpg`;
        img.alt = `UN SDG ${sdgNum}: ${sdgTitles[sdgNum] || ''}`;
        img.title = `SDG ${sdgNum}: ${sdgTitles[sdgNum] || ''}`;
        container.appendChild(img);
    });
}

// --- Event Listeners ---
const allChoices = [materialChoice, manufacturingChoice, distributionChoice, usePhaseChoice, endOfLifeChoice];
// CORRECTED: Fixed the typo in the function name below
allChoices.forEach(choice => choice.addEventListener('change', calculateAndDisplayLCA));

washCountSlider.addEventListener('input', () => {
    washCountDisplay.innerText = `${washCountSlider.value} washes`;
    calculateAndDisplayLCA();
});

resetButton.addEventListener('click', () => {
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
