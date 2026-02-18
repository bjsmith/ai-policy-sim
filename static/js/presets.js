/**
 * Preset Configurations for AI Policy Simulation
 *
 * Defines different scenario presets that users can quickly load
 */

const PRESETS = {
    'evidence-based': {
        name: 'Evidence-based (Current Research)',
        description: 'Parameters based on current research and empirical data',
        us: {
            compute: 3.5, compute_growth: 0.50, compute_constraint: 0.95,
            capital: 109, capital_growth: 0.30, capital_constraint: 0.90,
            talent: 63, talent_growth: 0.08, talent_constraint: 0.85,
            energy: 183, energy_growth_unconstrained: 0.18, energy_growth_grid: 0.06,
            total_generation: 4500, grid_threshold: 0.08
        },
        china: {
            compute: 0.6, compute_growth: 0.35, compute_constraint: 0.45,
            capital: 98, capital_growth: 0.25, capital_constraint: 0.70,
            talent: 52, talent_growth: 0.12, talent_constraint: 0.75,
            energy: 104, energy_growth_unconstrained: 0.20, energy_growth_grid: 0.07,
            total_generation: 8500, grid_threshold: 0.06
        }
    },
    'equal-starting': {
        name: 'Equal Starting Points',
        description: 'Both countries start with identical parameters',
        us: {
            compute: 2.0, compute_growth: 0.40, compute_constraint: 0.85,
            capital: 100, capital_growth: 0.27, capital_constraint: 0.80,
            talent: 57, talent_growth: 0.10, talent_constraint: 0.80,
            energy: 140, energy_growth_unconstrained: 0.19, energy_growth_grid: 0.065,
            total_generation: 6500, grid_threshold: 0.07
        },
        china: {
            compute: 2.0, compute_growth: 0.40, compute_constraint: 0.85,
            capital: 100, capital_growth: 0.27, capital_constraint: 0.80,
            talent: 57, talent_growth: 0.10, talent_constraint: 0.80,
            energy: 140, energy_growth_unconstrained: 0.19, energy_growth_grid: 0.065,
            total_generation: 6500, grid_threshold: 0.07
        }
    }
};

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
    setParameter('us-energy-growth-unconstrained', preset.us.energy_growth_unconstrained);
    setParameter('us-energy-growth-grid', preset.us.energy_growth_grid);
    setParameter('us-total-generation', preset.us.total_generation);
    setParameter('us-grid-threshold', preset.us.grid_threshold);

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
    setParameter('china-energy-growth-unconstrained', preset.china.energy_growth_unconstrained);
    setParameter('china-energy-growth-grid', preset.china.energy_growth_grid);
    setParameter('china-total-generation', preset.china.total_generation);
    setParameter('china-grid-threshold', preset.china.grid_threshold);

    // Update sidebar
    updateSidebar();
}
