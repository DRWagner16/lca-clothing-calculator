// --- Data for our Life Cycle Assessment ---
const lcaData = {
    material: { 
        conventional: { water: 2700, carbon: 5.8, sdgs: [6, 12, 15], stakeholders: { 'Workers': -1, 'Community': -2, 'Environment': -2, 'Consumer': 1, 'Company': 2 } },
        organic: { water: 950, carbon: 3.2, sdgs: [3, 6, 12, 15], stakeholders: { 'Workers': 2, 'Community': 1, 'Environment': 2, 'Consumer': 0, 'Company': -1 } },
        polyester: { water: 50, carbon: 8.5, sdgs: [7, 12, 13, 14], stakeholders: { 'Workers': 0, 'Community': -1, 'Environment': -2, 'Consumer': 1, 'Company': 1 } },
        blend: { water: 1400, carbon: 7.2, sdgs: [6, 7, 12, 15], stakeholders: { 'Workers': -1, 'Community': -1, 'Environment': -2, 'Consumer': 1, 'Company': 1 } }
    },
    manufacturing: {
        china: { water: 150, carbon: 3.1, urban: 'high local air pollution from concentrated industrial activity', sdgs: [8, 9, 11], stakeholders: { 'Workers': -1, 'Community': -2, 'Environment': -1, 'Consumer': 1, 'Company': 2 } },
        usa: { water: 120, carbon: 2.0, urban: 'moderate local air pollution due to mixed industrial and regulatory standards', sdgs: [8, 9], stakeholders: { 'Workers': 1, 'Community': 0, 'Environment': 0, 'Consumer': -1, 'Company': 0 } },
        india: { water: 160, carbon: 2.9, urban: 'high local air and water pollution from dense industrial zones', sdgs: [8, 9, 11], stakeholders: { 'Workers': -2, 'Community': -2, 'Environment': -1, 'Consumer': 1, 'Company': 2 } },
        eu: { water: 100, carbon: 1.5, urban: 'lower local air pollution due to stricter environmental regulations', sdgs: [8, 9, 12], stakeholders: { 'Workers': 2, 'Community': 1, 'Environment': 1, 'Consumer': -2, 'Company': -1 } },
        brazil: { water: 90, carbon: 0.8, urban: 'lower local air pollution, with primary impacts on land use from hydropower', sdgs: [7, 8, 9], stakeholders: { 'Workers': 0, 'Community': 1, 'Environment': 0, 'Consumer': 0, 'Company': 0 } }
    },
    distribution: { 
        sea: { water: 5, carbon: 0.2, urban: 'contributing to significant port traffic and related emissions', sdgs: [9, 11, 14], stakeholders: { 'Workers': 0, 'Community': -1, 'Environment': 0, 'Consumer': 0, 'Company': 1 } },
        air: { water: 10, carbon: 4.5, urban: 'requiring extensive truck traffic to and from airports, causing congestion', sdgs: [9, 11, 13], stakeholders: { 'Workers': 0, 'Community': -1, 'Environment': -2, 'Consumer': 1, 'Company': -1 } }
    },
    last_mile: {
        'diesel-truck': { water: 2, carbon: 0.8, urban: 'significant local air pollution (particulates, NOx) and noise from diesel trucks', sdgs: [3, 11], stakeholders: { 'Workers': 0, 'Community': -2, 'Environment': -1, 'Consumer': 0, 'Company': 0 } },
        'electric-van': { water: 1, carbon: 0.1, urban: 'reduced local air pollution and noise from electric vans', sdgs: [3, 7, 11], stakeholders: { 'Workers': 0, 'Community': 1, 'Environment': 1, 'Consumer': 0, 'Company': 0 } },
        'cargo-bike': { water: 0, carbon: 0.01, urban: 'no local emissions and reduced traffic congestion from cargo bikes', sdgs: [3, 11, 13], stakeholders: { 'Workers': 1, 'Community': 2, 'Environment': 2, 'Consumer': -1, 'Company': -1 } }
    },
    use_phase: {
        'hot-machine': { water: 8, carbon: 0.05, sdgs: [6, 7, 12], stakeholders: { 'Workers': 0, 'Community': 0, 'Environment': -1, 'Consumer': -1, 'Company': 0 } },
        'cold-line': { water: 5, carbon: 0.006, sdgs: [6, 7, 12], stakeholders: { 'Workers': 0, 'Community': 0, 'Environment': 1, 'Consumer': 1, 'Company': 0 } }
    },
    end_of_life: {
        landfill: { water: 5, carbon: 1.2, urban: 'significant truck traffic for waste hauling and potential for local ground pollution', sdgs: [11, 12], stakeholders: { 'Workers': 0, 'Community': -1, 'Environment': -2, 'Consumer': 0, 'Company': 0 } },
        recycle: { water: 50, carbon: -0.5, urban: 'moderate collection traffic but helps reduce the need for new industrial facilities', sdgs: [9, 11, 12], stakeholders: { 'Workers': 1, 'Community': 1, 'Environment': 2, 'Consumer': 0, 'Company': 0 } },
        incinerate: { water: 5, carbon: 2.8, urban: 'high truck traffic and the release of airborne particulates that affect local air quality', sdgs: [3, 11, 12], stakeholders: { 'Workers': 0, 'Community': -2, 'Environment': -1, 'Consumer': 0, 'Company': 1 } }
    }
};

// --- Get references to HTML elements ---
const materialChoice = document.getElementById('material-choice');
const manufacturingChoice = document.getElementById('manufacturing-choice');
const distributionChoice = document.getElementById('distribution-choice');
const lastMileChoice = document.getElementById('last-mile-choice');
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
const sdgSummaryTextEl = document.getElementById('sdg-summary-text');

// --- Chart Initialization ---
const doughnutChartLabels = ['Material', 'Manufacturing', 'Distribution', 'Last-Mile', 'Use Phase', 'End-of-Life'];
const doughnutChartColors = ['#003f5c', '#444e86', '#955196', '#dd5182', '#ff6e54', '#ffa600'];
const stakeholderLabels = ['Workers', 'Community', 'Environment', 'Consumer', 'Company'];

const createDoughnutChart = (canvasId, chartLabel) => {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, { type: 'doughnut', data: { labels: doughnutChartLabels, datasets: [{ label: chartLabel, data: [0,0,0,0,0,0], backgroundColor: doughnutChartColors, borderColor: '#ffffff', borderWidth: 2 }] }, options: { responsive: true, plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw.toFixed(1)}` } } } } });
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
                // UPDATED: Added a 'ticks' object to the y-axis to improve readability
                y: { 
                    title: { display: true, text: yAxisLabel },
                    ticks: { maxTicksLimit: 6 } // Limits the number of labels to prevent overlap
                } 
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

const createStakeholderChart = () => {
    const ctx = document.getElementById('stakeholderChart').getContext('2d');
    return new Chart(ctx, {
        type: 'radar',
        data: {
            labels: stakeholderLabels,
            datasets: [{
                label: 'Overall Stakeholder Impact',
                data: [0, 0, 0, 0, 0],
                fill: true,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)',
                pointBackgroundColor: 'rgb(54, 162, 235)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(54, 162, 235)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: { line: { tension: 0, borderWidth: 2 } },
            scales: { r: { suggestedMin: -8, suggestedMax: 8, pointLabels: { font: { size: 13 } }, ticks: { stepSize: 4 } } }
        }
    });
};

let waterChart = createDoughnutChart('waterChart', 'Water Usage (L)');
let carbonChart = createDoughnutChart('carbonChart', 'Carbon Footprint (kg CO₂e)');
let waterLineChart = createLineChart('waterLineChart', 'Cumulative Water (L)', '#75b3d3');
let carbonLineChart = createLineChart('carbonLineChart', 'Cumulative Carbon (kg CO₂e)', '#ff6361');
let stakeholderChart = createStakeholderChart();

// --- Main Calculation Function ---
function calculateAndDisplayLCA() {
    const material = lcaData.material[materialChoice.value];
    const manufacturing = lcaData.manufacturing[manufacturingChoice.value];
    const distribution = lcaData.distribution[distributionChoice.value];
    const last_mile = lcaData.last_mile[lastMileChoice.value];
    const end_of_life = lcaData.end_of_life[endOfLifeChoice.value];
    const usePhasePerWash = lcaData.use_phase[usePhaseChoice.value];
    
    displayStageSdgs('material-sdgs', material.sdgs);
    displayStageSdgs('manufacturing-sdgs', manufacturing.sdgs);
    displayStageSdgs('distribution-sdgs', distribution.sdgs);
    displayStageSdgs('last-mile-sdgs', last_mile.sdgs);
    displayStageSdgs('use-phase-sdgs', usePhasePerWash.sdgs);
    displayStageSdgs('end-of-life-sdgs', end_of_life.sdgs);
    
    const washCount = parseInt(washCountSlider.value);
    const use_phase = { 
        water: usePhasePerWash.water * washCount, 
        carbon: usePhasePerWash.carbon * washCount,
        stakeholders: Object.fromEntries(Object.entries(usePhasePerWash.stakeholders).map(([key, value]) => [key, value * (washCount / 50)]))
    };
    
    const totalWater = material.water + manufacturing.water + distribution.water + last_mile.water + use_phase.water + end_of_life.water;
    const totalCarbon = material.carbon + manufacturing.carbon + distribution.carbon + last_mile.carbon + use_phase.carbon + end_of_life.carbon;

    waterResultEl.innerText = totalWater.toFixed(0);
    carbonResultEl.innerText = totalCarbon.toFixed(1);
    
    const allSelections = [material, manufacturing, distribution, last_mile, use_phase, end_of_life];
    updateDoughnutCharts(...allSelections);
    updateEquivalencies(totalWater, totalCarbon);
    updateUrbanImpact(manufacturing, distribution, last_mile, end_of_life);
    updateLineCharts();
    updateSdgSummary(allSelections, {water: totalWater, carbon: totalCarbon});
    updateStakeholderChart(allSelections);
}

// --- Update Functions ---
function updateDoughnutCharts(material, manufacturing, distribution, last_mile, use_phase, end_of_life) {
    waterChart.data.datasets[0].data = [material.water, manufacturing.water, distribution.water, last_mile.water, use_phase.water, end_of_life.water];
    waterChart.update();
    carbonChart.data.datasets[0].data = [material.carbon, manufacturing.carbon, distribution.carbon, last_mile.carbon, use_phase.carbon, end_of_life.carbon];
    carbonChart.update();
}

function updateEquivalencies(totalWater, totalCarbon) {
    const yearsOfDrinkingWater = totalWater / (2.5 * 365);
    waterEquivalencyEl.innerText = `💧 Water to provide one person with drinking water for ${yearsOfDrinkingWater.toFixed(1)} years.`;
    const milesDriven = totalCarbon / 0.4;
    carbonEquivalencyEl.innerText = `💨 Carbon emissions from driving a car for ${milesDriven.toFixed(0)} miles.`;
}

function updateUrbanImpact(manufacturing, distribution, last_mile, end_of_life) {
    const impactText = `This scenario involves ${manufacturing.urban}. Long-haul distribution contributes to ${distribution.urban}, while final delivery via ${last_mile.urban}. Finally, its disposal results in ${end_of_life.urban}.`;
    urbanImpactTextEl.innerText = impactText;
}

function updateLineCharts() {
    const material = lcaData.material[materialChoice.value];
    const manufacturing = lcaData.manufacturing[manufacturingChoice.value];
    const distribution = lcaData.distribution[distributionChoice.value];
    const last_mile = lcaData.last_mile[lastMileChoice.value];
    const end_of_life = lcaData.end_of_life[endOfLifeChoice.value];
    const usePhasePerWash = lcaData.use_phase[usePhaseChoice.value];
    const fixedWaterImpact = material.water + manufacturing.water + distribution.water + last_mile.water + end_of_life.water;
    const fixedCarbonImpact = material.carbon + manufacturing.carbon + distribution.carbon + last_mile.carbon + end_of_life.carbon;
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

function updateSdgSummary(selections, totals) {
    const uniqueSdgs = [...new Set(selections.flatMap(choice => choice.sdgs || []))];
    let summaryParts = [];
    if (uniqueSdgs.includes(12)) {
        const washCount = parseInt(washCountSlider.value);
        const phrase = washCount > 125 ? "Maximizing the garment's utility" : "Extending the garment's life";
        summaryParts.push(`${phrase} to ${washCount} washes strongly supports <strong>SDG 12 (Responsible Consumption)</strong>.`);
    }
    if (uniqueSdgs.includes(6) && totals.water > 2500) {
        summaryParts.push(`The high water usage in this scenario creates challenges for <strong>SDG 6 (Clean Water and Sanitation)</strong>.`);
    }
    if (uniqueSdgs.includes(13) && totals.carbon > 10) {
        summaryParts.push(`A high carbon footprint has direct consequences for <strong>SDG 13 (Climate Action)</strong>.`);
    }
    if (uniqueSdgs.includes(3) || uniqueSdgs.includes(11)) {
        const lastMileChoice = selections[3];
        if(lastMileChoice.urban.includes('significant')) {
            summaryParts.push(`Delivery and disposal choices impact urban air quality, linking to <strong>SDG 3 (Good Health)</strong> and <strong>SDG 11 (Sustainable Cities)</strong>.`);
        }
    }
    if (summaryParts.length > 0) {
        sdgSummaryTextEl.innerHTML = summaryParts.join('<br><br>');
    } else {
        sdgSummaryTextEl.innerHTML = 'Each choice in the lifecycle has an impact on global development goals.';
    }
}

function updateStakeholderChart(selections) {
    const finalScores = { 'Workers': 0, 'Community': 0, 'Environment': 0, 'Consumer': 0, 'Company': 0 };
    selections.forEach(sel => {
        for (const stakeholder of stakeholderLabels) {
            finalScores[stakeholder] += sel.stakeholders[stakeholder] || 0;
        }
    });
    stakeholderChart.data.datasets[0].data = stakeholderLabels.map(label => finalScores[label]);
    stakeholderChart.update();
}

// --- Event Listeners ---
const allChoices = [materialChoice, manufacturingChoice, distributionChoice, lastMileChoice, usePhaseChoice, endOfLifeChoice];
allChoices.forEach(choice => choice.addEventListener('change', calculateAndDisplayLCA));

washCountSlider.addEventListener('input', () => {
    washCountDisplay.innerText = `${washCountSlider.value} washes`;
    calculateAndDisplayLCA();
});

resetButton.addEventListener('click', () => {
    materialChoice.value = 'conventional';
    manufacturingChoice.value = 'china';
    distributionChoice.value = 'sea';
    lastMileChoice.value = 'diesel-truck';
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
