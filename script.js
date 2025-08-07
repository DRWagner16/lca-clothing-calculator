// --- Data for our Life Cycle Assessment ---
// These are simplified, illustrative values for educational purposes.
// Water is in Liters (L) per t-shirt.
// Carbon is in kilograms of CO2 equivalent (kg CO2e) per t-shirt.
const lcaData = {
    material: {
        conventional: { water: 2700, carbon: 5.8 },
        organic: { water: 950, carbon: 3.2 }
    },
    manufacturing: {
        china: { water: 150, carbon: 3.1 },
        eu: { water: 100, carbon: 1.5 }
    },
    use_phase: {
        'hot-machine': { water: 400, carbon: 2.5 }, // 50 washes * 8L/wash
        'cold-line': { water: 250, carbon: 0.3 }  // 50 washes * 5L/wash
    }
    // Note: We are simplifying and excluding distribution and end-of-life for this example.
};

// --- Get references to our HTML elements ---
const materialChoice = document.getElementById('material-choice');
const manufacturingChoice = document.getElementById('manufacturing-choice');
const usePhaseChoice = document.getElementById('use-phase-choice');

const waterResultEl = document.getElementById('water-result');
const carbonResultEl = document.getElementById('carbon-result');

// --- Main Calculation Function ---
function calculateLCA() {
    // 1. Get the current user choices from the dropdowns
    const material = materialChoice.value;
    const manufacturing = manufacturingChoice.value;
    const use_phase = usePhaseChoice.value;

    // 2. Calculate the total water and carbon based on choices
    const totalWater = lcaData.material[material].water + 
                       lcaData.manufacturing[manufacturing].water + 
                       lcaData.use_phase[use_phase].water;

    const totalCarbon = lcaData.material[material].carbon +
                        lcaData.manufacturing[manufacturing].carbon +
                        lcaData.use_phase[use_phase].carbon;

    // 3. Update the results on the webpage
    // .toFixed(1) rounds the number to one decimal place
    waterResultEl.innerText = totalWater.toFixed(0);
    carbonResultEl.innerText = totalCarbon.toFixed(1);
}

// --- Event Listeners ---
// These lines tell the browser to run our calculateLCA function
// whenever the user changes their selection in any of the dropdowns.
materialChoice.addEventListener('change', calculateLCA);
manufacturingChoice.addEventListener('change', calculateLCA);
usePhaseChoice.addEventListener('change', calculateLCA);

// --- Initial Calculation ---
// Run the calculation once when the page first loads to show the default values.
document.addEventListener('DOMContentLoaded', calculateLCA);
