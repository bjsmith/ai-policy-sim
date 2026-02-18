// Global variables for charts
let progressChart = null;
let trainingCapacityChart = null;
let computeChart = null;
let capitalChart = null;
let talentChart = null;
let energyChart = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDefaults();
    setupInputListeners();
    // Load research report on initial page load since it's the default tab
    loadResearchReport();
});

// Setup listeners for all input sliders
function setupInputListeners() {
    const inputs = document.querySelectorAll('input[type="range"]');
    inputs.forEach(input => {
        input.addEventListener('input', function(e) {
            updateValueDisplay(e.target.id, e.target.value);
        });
    });
}

// Update the displayed value for a slider
function updateValueDisplay(id, value) {
    const valueSpan = document.getElementById(id + '-value');
    if (!valueSpan) return;

    let displayValue = value;

    // Format based on parameter type
    if (id.includes('growth')) {
        displayValue = (parseFloat(value) * 100).toFixed(0) + '%';
    } else if (id.includes('constraint')) {
        displayValue = (parseFloat(value) * 100).toFixed(0) + '%';
    } else if (id.includes('threshold')) {
        displayValue = (parseFloat(value) * 100).toFixed(0) + '%';
    } else if (id.includes('compute') && !id.includes('constraint')) {
        displayValue = parseFloat(value).toFixed(1);
    } else if (id.includes('capital') || id.includes('energy') || id.includes('generation')) {
        displayValue = Math.round(value);
    } else if (id.includes('talent')) {
        displayValue = Math.round(value);
    }

    valueSpan.textContent = displayValue;
}

// Update sidebar summary when settings change
function updateSidebar() {
    // Update US values in sidebar
    document.getElementById('sidebar-us-compute').textContent =
        parseFloat(document.getElementById('us-compute').value).toFixed(1);
    document.getElementById('sidebar-us-compute-growth').textContent =
        (parseFloat(document.getElementById('us-compute-growth').value) * 100).toFixed(0);
    document.getElementById('sidebar-us-capital').textContent =
        Math.round(document.getElementById('us-capital').value);
    document.getElementById('sidebar-us-capital-growth').textContent =
        (parseFloat(document.getElementById('us-capital-growth').value) * 100).toFixed(0);
    document.getElementById('sidebar-us-talent').textContent =
        Math.round(document.getElementById('us-talent').value);
    document.getElementById('sidebar-us-talent-growth').textContent =
        (parseFloat(document.getElementById('us-talent-growth').value) * 100).toFixed(0);
    document.getElementById('sidebar-us-energy').textContent =
        Math.round(document.getElementById('us-energy').value);
    document.getElementById('sidebar-us-energy-growth').textContent =
        (parseFloat(document.getElementById('us-energy-growth-unconstrained').value) * 100).toFixed(0);

    // Update China values in sidebar
    document.getElementById('sidebar-china-compute').textContent =
        parseFloat(document.getElementById('china-compute').value).toFixed(1);
    document.getElementById('sidebar-china-compute-growth').textContent =
        (parseFloat(document.getElementById('china-compute-growth').value) * 100).toFixed(0);
    document.getElementById('sidebar-china-capital').textContent =
        Math.round(document.getElementById('china-capital').value);
    document.getElementById('sidebar-china-capital-growth').textContent =
        (parseFloat(document.getElementById('china-capital-growth').value) * 100).toFixed(0);
    document.getElementById('sidebar-china-talent').textContent =
        Math.round(document.getElementById('china-talent').value);
    document.getElementById('sidebar-china-talent-growth').textContent =
        (parseFloat(document.getElementById('china-talent-growth').value) * 100).toFixed(0);
    document.getElementById('sidebar-china-energy').textContent =
        Math.round(document.getElementById('china-energy').value);
    document.getElementById('sidebar-china-energy-growth').textContent =
        (parseFloat(document.getElementById('china-energy-growth-unconstrained').value) * 100).toFixed(0);

    // Update grid threshold in sidebar
    const usThreshold = document.getElementById('us-grid-threshold');
    if (usThreshold) {
        document.getElementById('sidebar-grid-threshold').textContent =
            (parseFloat(usThreshold.value) * 100).toFixed(0);
    }
}

// Apply a preset configuration
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

// Load default parameters
async function loadDefaults() {
    try {
        const response = await fetch('/api/defaults');
        const data = await response.json();

        // Set US parameters
        setParameter('us-compute', data.us.compute_mean);
        setParameter('us-compute-growth', data.us.compute_growth_rate);
        setParameter('us-compute-constraint', data.us.compute_constraint);
        setParameter('us-capital', data.us.capital_mean);
        setParameter('us-capital-growth', data.us.capital_growth_rate);
        setParameter('us-capital-constraint', data.us.capital_constraint);
        setParameter('us-talent', data.us.talent_mean);
        setParameter('us-talent-growth', data.us.talent_growth_rate);
        setParameter('us-talent-constraint', data.us.talent_constraint);
        setParameter('us-energy', data.us.energy_mean);
        setParameter('us-energy-growth', data.us.energy_growth_rate);
        setParameter('us-energy-constraint', data.us.energy_constraint);

        // Set China parameters
        setParameter('china-compute', data.china.compute_mean);
        setParameter('china-compute-growth', data.china.compute_growth_rate);
        setParameter('china-compute-constraint', data.china.compute_constraint);
        setParameter('china-capital', data.china.capital_mean);
        setParameter('china-capital-growth', data.china.capital_growth_rate);
        setParameter('china-capital-constraint', data.china.capital_constraint);
        setParameter('china-talent', data.china.talent_mean);
        setParameter('china-talent-growth', data.china.talent_growth_rate);
        setParameter('china-talent-constraint', data.china.talent_constraint);
        setParameter('china-energy', data.china.energy_mean);
        setParameter('china-energy-growth', data.china.energy_growth_rate);
        setParameter('china-energy-constraint', data.china.energy_constraint);

        // Update sidebar with new values
        updateSidebar();

    } catch (error) {
        console.error('Error loading defaults:', error);
    }
}

// Helper to set a parameter value and update display
function setParameter(id, value) {
    const input = document.getElementById(id);
    if (input) {
        input.value = value;
        updateValueDisplay(id, value);
    }
}

// Get current parameter values from UI
function getParameters() {
    return {
        us: {
            compute_mean: parseFloat(document.getElementById('us-compute').value),
            compute_growth_rate: parseFloat(document.getElementById('us-compute-growth').value),
            compute_constraint: parseFloat(document.getElementById('us-compute-constraint').value),
            capital_mean: parseFloat(document.getElementById('us-capital').value),
            capital_growth_rate: parseFloat(document.getElementById('us-capital-growth').value),
            capital_constraint: parseFloat(document.getElementById('us-capital-constraint').value),
            talent_mean: parseFloat(document.getElementById('us-talent').value),
            talent_growth_rate: parseFloat(document.getElementById('us-talent-growth').value),
            talent_constraint: parseFloat(document.getElementById('us-talent-constraint').value),
            energy_mean: parseFloat(document.getElementById('us-energy').value),
            energy_growth_unconstrained: parseFloat(document.getElementById('us-energy-growth-unconstrained').value),
            energy_growth_grid: parseFloat(document.getElementById('us-energy-growth-grid').value),
            total_generation: parseFloat(document.getElementById('us-total-generation').value),
            grid_threshold: parseFloat(document.getElementById('us-grid-threshold').value),
        },
        china: {
            compute_mean: parseFloat(document.getElementById('china-compute').value),
            compute_growth_rate: parseFloat(document.getElementById('china-compute-growth').value),
            compute_constraint: parseFloat(document.getElementById('china-compute-constraint').value),
            capital_mean: parseFloat(document.getElementById('china-capital').value),
            capital_growth_rate: parseFloat(document.getElementById('china-capital-growth').value),
            capital_constraint: parseFloat(document.getElementById('china-capital-constraint').value),
            talent_mean: parseFloat(document.getElementById('china-talent').value),
            talent_growth_rate: parseFloat(document.getElementById('china-talent-growth').value),
            talent_constraint: parseFloat(document.getElementById('china-talent-constraint').value),
            energy_mean: parseFloat(document.getElementById('china-energy').value),
            energy_growth_unconstrained: parseFloat(document.getElementById('china-energy-growth-unconstrained').value),
            energy_growth_grid: parseFloat(document.getElementById('china-energy-growth-grid').value),
            total_generation: parseFloat(document.getElementById('china-total-generation').value),
            grid_threshold: parseFloat(document.getElementById('china-grid-threshold').value),
        },
        years: 10,
        samples: 1000
    };
}

// Run the simulation
async function runSimulation() {
    const loading = document.getElementById('loading');

    // Show loading state
    loading.classList.add('active');

    try {
        const params = getParameters();
        const response = await fetch('/api/simulate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        });

        const data = await response.json();

        // Update metrics
        document.getElementById('catchup-prob').textContent =
            (data.metrics.catchup_probability * 100).toFixed(1) + '%';
        document.getElementById('surpass-prob').textContent =
            (data.metrics.surpass_probability * 100).toFixed(1) + '%';
        document.getElementById('us-final').textContent =
            data.metrics.us_final_median.toFixed(2);
        document.getElementById('china-final').textContent =
            data.metrics.china_final_median.toFixed(2);

        // Create charts
        createProgressChart(data.stats, data.years);
        createTrainingCapacityChart(data.stats, data.years);
        createFactorCharts(data.stats, data.years);

        // Switch to progress tab to show results
        showTab('progress');

    } catch (error) {
        console.error('Error running simulation:', error);
        alert('Error running simulation. Please try again.');
    } finally {
        loading.classList.remove('active');
    }
}

// Create the main progress chart
function createProgressChart(stats, years) {
    const ctx = document.getElementById('progressChart').getContext('2d');

    // Destroy existing chart
    if (progressChart) {
        progressChart.destroy();
    }

    const currentYear = 2026;
    const labels = Array.from({length: years}, (_, i) => `${currentYear + i}`);

    progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                // US datasets
                {
                    label: 'US (Median)',
                    data: stats.us_progress.p50,
                    borderColor: 'rgba(74, 144, 226, 1)',
                    backgroundColor: 'rgba(74, 144, 226, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'US (25th-75th percentile)',
                    data: stats.us_progress.p75,
                    borderColor: 'rgba(74, 144, 226, 0.3)',
                    backgroundColor: 'rgba(74, 144, 226, 0.2)',
                    borderWidth: 0,
                    tension: 0.4,
                    fill: '+1',
                    pointRadius: 0
                },
                {
                    label: 'US (25th percentile)',
                    data: stats.us_progress.p25,
                    borderColor: 'rgba(74, 144, 226, 0.3)',
                    backgroundColor: 'rgba(74, 144, 226, 0.2)',
                    borderWidth: 0,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 0
                },
                // China datasets
                {
                    label: 'China (Median)',
                    data: stats.china_progress.p50,
                    borderColor: 'rgba(226, 74, 74, 1)',
                    backgroundColor: 'rgba(226, 74, 74, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'China (25th-75th percentile)',
                    data: stats.china_progress.p75,
                    borderColor: 'rgba(226, 74, 74, 0.3)',
                    backgroundColor: 'rgba(226, 74, 74, 0.2)',
                    borderWidth: 0,
                    tension: 0.4,
                    fill: '+1',
                    pointRadius: 0
                },
                {
                    label: 'China (25th percentile)',
                    data: stats.china_progress.p25,
                    borderColor: 'rgba(226, 74, 74, 0.3)',
                    backgroundColor: 'rgba(226, 74, 74, 0.2)',
                    borderWidth: 0,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Frontier AI Progress Over Time (with uncertainty bands)',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        filter: function(item, chart) {
                            // Only show median lines in legend
                            return item.text.includes('Median');
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Progress Index (higher = more advanced)',
                        font: { size: 14 }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Create the training capacity chart
function createTrainingCapacityChart(stats, years) {
    const ctx = document.getElementById('trainingCapacityChart').getContext('2d');

    // Destroy existing chart
    if (trainingCapacityChart) {
        trainingCapacityChart.destroy();
    }

    const currentYear = 2026;
    const labels = Array.from({length: years}, (_, i) => `${currentYear + i}`);

    // Convert YottaFLOPS-years to FLOPS-years (multiply by 1e24)
    const convertToFLOPS = (data) => data.map(val => val * 1e24);

    trainingCapacityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                // US datasets
                {
                    label: 'US (Median)',
                    data: convertToFLOPS(stats.us_training_capacity.p50),
                    borderColor: 'rgba(74, 144, 226, 1)',
                    backgroundColor: 'rgba(74, 144, 226, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'US (25th-75th percentile)',
                    data: convertToFLOPS(stats.us_training_capacity.p75),
                    borderColor: 'rgba(74, 144, 226, 0.3)',
                    backgroundColor: 'rgba(74, 144, 226, 0.2)',
                    borderWidth: 0,
                    tension: 0.4,
                    fill: '+1',
                    pointRadius: 0
                },
                {
                    label: 'US (25th percentile)',
                    data: convertToFLOPS(stats.us_training_capacity.p25),
                    borderColor: 'rgba(74, 144, 226, 0.3)',
                    backgroundColor: 'rgba(74, 144, 226, 0.2)',
                    borderWidth: 0,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 0
                },
                // China datasets
                {
                    label: 'China (Median)',
                    data: convertToFLOPS(stats.china_training_capacity.p50),
                    borderColor: 'rgba(226, 74, 74, 1)',
                    backgroundColor: 'rgba(226, 74, 74, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'China (25th-75th percentile)',
                    data: convertToFLOPS(stats.china_training_capacity.p75),
                    borderColor: 'rgba(226, 74, 74, 0.3)',
                    backgroundColor: 'rgba(226, 74, 74, 0.2)',
                    borderWidth: 0,
                    tension: 0.4,
                    fill: '+1',
                    pointRadius: 0
                },
                {
                    label: 'China (25th percentile)',
                    data: convertToFLOPS(stats.china_training_capacity.p25),
                    borderColor: 'rgba(226, 74, 74, 0.3)',
                    backgroundColor: 'rgba(226, 74, 74, 0.2)',
                    borderWidth: 0,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Annual Training Compute Capacity (with uncertainty bands)',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        filter: function(item, chart) {
                            // Only show median lines in legend
                            return item.text.includes('Median');
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toExponential(2) + ' FLOP/y';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Training Capacity (FLOP/y)',
                        font: { size: 14 }
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            // Calculate the exponent
                            const exponent = Math.log10(value);
                            // Only show labels at powers of 10
                            if (Math.abs(exponent - Math.round(exponent)) < 0.01) {
                                return '1e' + Math.round(exponent);
                            }
                            return '';
                        },
                        // Force ticks at every order of magnitude
                        autoSkip: false,
                        maxRotation: 0,
                        minRotation: 0
                    },
                    grid: {
                        color: function(context) {
                            const value = context.tick.value;
                            const exponent = Math.log10(value);
                            // Major gridlines at every OOM (1e28, 1e29, etc)
                            if (Math.abs(exponent - Math.round(exponent)) < 0.01) {
                                return 'rgba(0, 0, 0, 0.2)';  // Darker for major gridlines
                            }
                            return 'rgba(0, 0, 0, 0.05)';  // Light for minor gridlines
                        },
                        lineWidth: function(context) {
                            const value = context.tick.value;
                            const exponent = Math.log10(value);
                            // Thicker lines at every OOM
                            if (Math.abs(exponent - Math.round(exponent)) < 0.01) {
                                return 2;
                            }
                            return 1;
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Create factor comparison charts
function createFactorCharts(stats, years) {
    const currentYear = 2026;
    const labels = Array.from({length: years}, (_, i) => `${currentYear + i}`);

    // Compute chart
    createFactorChart('computeChart', 'Compute Capacity (H100-equiv. GPUs, millions)', labels, {
        us: stats.us_compute.p50,
        china: stats.china_compute.p50
    }, computeChart);

    // Capital chart
    createFactorChart('capitalChart', 'AI Investment Capital (billions USD)', labels, {
        us: stats.us_capital.p50,
        china: stats.china_capital.p50
    }, capitalChart);

    // Talent chart
    createFactorChart('talentChart', 'AI Researchers (thousands)', labels, {
        us: stats.us_talent.p50,
        china: stats.china_talent.p50
    }, talentChart);

    // Energy chart
    createFactorChart('energyChart', 'Available Energy for AI (TWh)', labels, {
        us: stats.us_energy.p50,
        china: stats.china_energy.p50
    }, energyChart);
}

// Helper to create individual factor charts
function createFactorChart(canvasId, title, labels, data, existingChart) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    // Destroy existing chart
    if (existingChart) {
        existingChart.destroy();
    }

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'US',
                    data: data.us,
                    borderColor: 'rgba(74, 144, 226, 1)',
                    backgroundColor: 'rgba(74, 144, 226, 0.2)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'China',
                    data: data.china,
                    borderColor: 'rgba(226, 74, 74, 1)',
                    backgroundColor: 'rgba(226, 74, 74, 0.2)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: { size: 13, weight: 'bold' }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });

    // Update the global variable
    if (canvasId === 'computeChart') computeChart = chart;
    else if (canvasId === 'capitalChart') capitalChart = chart;
    else if (canvasId === 'talentChart') talentChart = chart;
    else if (canvasId === 'energyChart') energyChart = chart;
}

// Tab switching
function showTab(tabName) {
    console.log('showTab called with:', tabName);

    // Update tab buttons
    document.getElementById('tab-progress').classList.remove('active');
    document.getElementById('tab-factors').classList.remove('active');
    document.getElementById('tab-settings').classList.remove('active');
    document.getElementById('tab-report').classList.remove('active');
    document.getElementById('tab-' + tabName).classList.add('active');

    // Show/hide content
    const progressTab = document.getElementById('progress-tab');
    const factorsTab = document.getElementById('factors-tab');
    const settingsTab = document.getElementById('settings-tab');
    const reportTab = document.getElementById('report-tab');

    if (tabName === 'progress') {
        progressTab.style.display = 'block';
        factorsTab.style.display = 'none';
        settingsTab.style.display = 'none';
        reportTab.style.display = 'none';
    } else if (tabName === 'factors') {
        progressTab.style.display = 'none';
        factorsTab.style.display = 'block';
        settingsTab.style.display = 'none';
        reportTab.style.display = 'none';
    } else if (tabName === 'settings') {
        progressTab.style.display = 'none';
        factorsTab.style.display = 'none';
        settingsTab.style.display = 'block';
        reportTab.style.display = 'none';
    } else if (tabName === 'report') {
        progressTab.style.display = 'none';
        factorsTab.style.display = 'none';
        settingsTab.style.display = 'none';
        reportTab.style.display = 'block';

        // Load research report if not already loaded
        loadResearchReport();
    }
}

// Load research report from backend
async function loadResearchReport() {
    console.log('loadResearchReport called');

    const reportSections = document.getElementById('report-sections');
    const reportLoading = document.getElementById('report-loading');
    const reportMain = document.getElementById('report-main');

    console.log('reportSections:', reportSections);
    console.log('reportLoading:', reportLoading);

    // Check if already loaded (check for actual content, not just HTML comments)
    const hasContent = reportSections.querySelector('.report-section') !== null;
    console.log('Has content already?', hasContent);

    if (hasContent) {
        reportLoading.classList.remove('active');
        reportMain.style.display = 'grid';
        console.log('Content already loaded, showing it');
        return;
    }

    reportLoading.classList.add('active');
    reportMain.style.display = 'none';

    console.log('Starting fetch...');

    try {
        const response = await fetch('/api/research-report');
        console.log('Fetch response received:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log('Research report loaded:', data);
        console.log('Data keys:', Object.keys(data));

        // Build the HTML content with section IDs for anchoring
        let html = '';

        // Add methodology section first
        html += '<div class="report-section" id="methodology">' + data.methodology + '</div>';
        html += '<div class="factor-divider"></div>';

        // Add compute section
        html += '<div class="report-section" id="compute">' + data.compute + '</div>';
        html += '<div class="factor-divider"></div>';

        // Add capital section
        html += '<div class="report-section" id="capital">' + data.capital + '</div>';
        html += '<div class="factor-divider"></div>';

        // Add talent section
        html += '<div class="report-section" id="talent">' + data.talent + '</div>';
        html += '<div class="factor-divider"></div>';

        // Add energy section
        html += '<div class="report-section" id="energy">' + data.energy + '</div>';
        html += '<div class="factor-divider"></div>';

        // Add synthesis section
        html += '<div class="report-section" id="synthesis">' + data.synthesis + '</div>';

        console.log('Built HTML, length:', html.length);

        reportSections.innerHTML = html;
        console.log('HTML inserted into reportSections');

        reportLoading.classList.remove('active');
        reportMain.style.display = 'grid';

        // Setup TOC functionality
        setupTOC();

        console.log('Report display complete');

    } catch (error) {
        console.error('Error loading research report:', error);
        reportSections.innerHTML = '<p style="color: red;">Error loading research report: ' + error.message + '</p>';
        reportLoading.classList.remove('active');
        reportMain.style.display = 'grid';
    }
}

// Setup Table of Contents functionality
function setupTOC() {
    const tocLinks = document.querySelectorAll('.report-toc a');
    const sections = document.querySelectorAll('.report-section');

    // Smooth scroll to section on click
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Highlight active section on scroll
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                tocLinks.forEach(link => link.classList.remove('active'));

                // Add active class to current section's link
                const activeLink = document.querySelector(`.report-toc a[data-section="${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
}
