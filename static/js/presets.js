/**
 * Preset Configurations for AI Policy Simulation
 *
 * Presets are now loaded from presets.json file
 */

let PRESETS = {};

/**
 * Load presets from JSON file
 */
async function loadPresets() {
    try {
        const response = await fetch('/api/presets');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        PRESETS = await response.json();
        console.log('Presets loaded successfully:', Object.keys(PRESETS));
    } catch (error) {
        console.error('Error loading presets:', error);
        // Fallback to empty presets
        PRESETS = {};
    }
}

/**
 * Apply a preset configuration to the UI
 */
function applyPreset() {
    const presetName = document.getElementById('preset-selector').value;
    const preset = PRESETS[presetName];

    if (!preset) {
        console.error('Unknown preset:', presetName);
        return;
    }

    // Apply US parameters
    setParameter('us-compute', preset.us.compute);
    setParameter('us-compute-growth', preset.us.compute_growth);
    setParameter('us-compute-constraint', preset.us.compute_constraint);
    setParameter('us-capital', preset.us.capital);
    setParameter('us-capital-growth', preset.us.capital_growth);
    setParameter('us-capital-constraint', preset.us.capital_constraint);
    setParameter('us-talent', preset.us.talent);
    setParameter('us-talent-growth', preset.us.talent_growth);
    setParameter('us-talent-constraint', preset.us.talent_constraint);
    setParameter('us-energy', preset.us.energy);
    setParameter('us-total-grid-energy', preset.us.total_grid_energy);
    setParameter('us-grid-growth-rate', preset.us.grid_growth_rate);
    setParameter('us-efficiency-improvement-rate', preset.us.efficiency_improvement_rate);
    setParameter('us-grid-saturation-threshold', preset.us.grid_saturation_threshold);

    // Apply China parameters
    setParameter('china-compute', preset.china.compute);
    setParameter('china-compute-growth', preset.china.compute_growth);
    setParameter('china-compute-constraint', preset.china.compute_constraint);
    setParameter('china-capital', preset.china.capital);
    setParameter('china-capital-growth', preset.china.capital_growth);
    setParameter('china-capital-constraint', preset.china.capital_constraint);
    setParameter('china-talent', preset.china.talent);
    setParameter('china-talent-growth', preset.china.talent_growth);
    setParameter('china-talent-constraint', preset.china.talent_constraint);
    setParameter('china-energy', preset.china.energy);
    setParameter('china-total-grid-energy', preset.china.total_grid_energy);
    setParameter('china-grid-growth-rate', preset.china.grid_growth_rate);
    setParameter('china-efficiency-improvement-rate', preset.china.efficiency_improvement_rate);
    setParameter('china-grid-saturation-threshold', preset.china.grid_saturation_threshold);

    // Update sidebar
    updateSidebar();
}
