// --- Data for our Life Cycle Assessment ---
// These are simplified, illustrative values for educational purposes.
// Water is in Liters (L) per t-shirt.
// Carbon is in kilograms of CO2 equivalent (kg CO2e) per t-shirt.
const lcaData = {
    material: {
        conventional: { water: 2700, carbon: 5.8 }, // High water use for irrigation
        organic: { water: 950, carbon: 3.2 },      // Less water, no synthetic pesticides/fertilizers
        polyester: { water: 50, carbon: 8.5 },     // Low water, but high carbon from fossil fuels
        blend: { water: 1400, carbon: 7.2 }        // An average of conventional cotton and polyester
    },
    manufacturing: {
        china: { water: 150, carbon: 3.1 },  // Energy from a coal-heavy grid
        usa: { water: 120, carbon: 2.0 },    // Energy from a mixed grid (gas, nuclear, renewables)
        india: { water: 160, carbon: 2.9 },  // Water-stressed region, coal-heavy grid
        eu: { water: 100, carbon: 1.5 },     // More renewables and efficient processes
        brazil: { water: 90, carbon: 0.8 }   // Energy from a hydropower-dominant grid
    },
    use_phase: {
        'hot-machine': { water: 400, carbon: 2.5 }, // Energy intensive washing and drying
        'cold-line': { water: 250, carbon: 0.3 }  // Low energy use
    }
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
