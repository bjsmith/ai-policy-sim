# US-China AI Policy Simulation

A probabilistic, longitudinal simulation for analyzing frontier AI development based on four key factors: compute, capital, talent, and energy.

## Overview

This simulation uses Monte Carlo methods to model how different policy constraints and resource allocations could shape AI progress in the United States and China over a 10-year horizon. Each simulation run generates 200 probabilistic scenarios to capture uncertainty in each factor.

## Key Features

- **Probabilistic Modeling**: Uses Monte Carlo sampling with log-normal distributions to capture realistic uncertainty
- **Longitudinal Analysis**: Tracks progress year-by-year with path dependency (progress builds on itself)
- **Four-Factor Framework**: Models the interaction of compute, capital, talent, and energy
- **Interactive UI**: Real-time parameter adjustment with compelling visualizations
- **Policy Scenario Analysis**: Explore impacts of export controls, investment constraints, and resource limitations

## The Model

### Progress Function

The model uses a Cobb-Douglas style production function:

```
Progress = (Compute^0.40) × (Capital^0.25) × (Talent^0.25) × (Energy^0.10) × CumulativeEffect
```

Where:
- **Compute** (40% weight): Most critical bottleneck for frontier AI
- **Capital** (25% weight): Enables all other factors
- **Talent** (25% weight): Crucial for research efficiency
- **Energy** (10% weight): Enabling but less constraining currently

### Default Parameters (Based on 2024-2025 Research)

#### United States
- **Compute**: 3.5M H100-equivalent GPUs, 50% annual growth, 95% constraint
  - Source: ~3.56M H100s deployed 2025, Nvidia producing 4-5M chips/year
- **Capital**: $109B investment, 30% annual growth, 90% constraint
  - Source: $109B private AI investment 2024
- **Talent**: 63K AI researchers, 8% annual growth, 85% constraint
  - Source: ~63K AI researchers in US
- **Energy**: 183 TWh, 15% annual growth, 80% constraint
  - Source: 183 TWh data center consumption 2024

#### China
- **Compute**: 0.6M H100-equivalent GPUs, 35% annual growth, 45% constraint
  - Source: ~1.46M H20 chips (70% less capable) + 200-300K domestic chips
  - Heavy export control constraints
- **Capital**: $98B investment, 25% annual growth, 70% constraint
  - Source: $98B total AI investment, mostly government-directed
- **Talent**: 52K AI researchers, 12% annual growth, 75% constraint
  - Source: ~52K AI researchers in China
- **Energy**: 104 TWh, 20% annual growth, 70% constraint
  - Source: 25% of global data center consumption

### Constraint Parameter

The "constraint" parameter (0-1 scale) represents policy and infrastructure limitations:
- **1.0** = No constraints (theoretical maximum achievable)
- **0.5** = 50% constraint (export controls cut available compute in half)
- **0.0** = Complete blockade

Examples:
- US compute constraint (0.95): Minimal constraints, limited by market dynamics
- China compute constraint (0.45): Heavy export controls limiting advanced chip access

## Installation

### Option 1: Quick Start (Using existing venv)
```bash
cd ai-policy-sim
./run.sh
```

### Option 2: Fresh Installation
```bash
cd ai-policy-sim
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

Then open your browser to: `http://localhost:5000`

## Usage

### Running Scenarios

1. **Default Scenario**: Click "Run Simulation" to see baseline projections
2. **Policy Scenarios**: Adjust constraint sliders to model policy interventions:
   - Stricter export controls: Reduce China's compute constraint to 0.2-0.3
   - Relaxed controls: Increase to 0.7-0.8
   - Immigration reform: Adjust US talent constraint
   - Energy infrastructure: Modify energy growth rates

3. **Resource Scenarios**: Adjust base values and growth rates:
   - Breakthrough in domestic chip production: Increase China compute growth
   - AI winter in funding: Reduce capital growth rates
   - Brain drain/gain: Adjust talent base values

### Interpreting Results

#### Key Metrics

- **Catch-up Probability**: Likelihood China reaches 90% of US progress
- **Surpass Probability**: Likelihood China exceeds US progress
- **Progress Index**: Composite measure of frontier AI capability (higher = more advanced)

#### Uncertainty Bands

Charts show median trajectories with 25th-75th percentile bands, representing the range of likely outcomes given uncertainty in each factor.

## Example Scenarios

### Scenario 1: Stricter Export Controls
- Set China compute constraint to 0.25
- Result: Wider gap, lower catch-up probability

### Scenario 2: China Domestic Breakthrough
- Increase China compute to 1.5M, growth to 0.60, constraint to 0.70
- Result: Narrower gap, higher catch-up probability

### Scenario 3: AI Boom Scenario
- Increase both countries' capital growth to 0.50
- Result: Faster absolute progress for both

### Scenario 4: Energy Constraints
- Reduce US energy constraint to 0.50, growth to 0.05
- Result: US progress slows due to infrastructure bottleneck

## Technical Details

### Simulation Engine

- **Language**: Python with NumPy for vectorized Monte Carlo sampling
- **Sampling**: Log-normal distributions for realistic economic/technical factors
- **Path Dependency**: Progress builds cumulatively with logarithmic learning effects
- **Samples**: 200 per simulation run (adjustable)

### Frontend

- **Framework**: Flask + vanilla JavaScript
- **Visualization**: Chart.js for interactive time-series plots
- **Design**: Responsive gradient UI with real-time parameter updates

## Limitations & Caveats

1. **Simplified Model**: Real AI progress depends on many factors beyond these four
2. **Linear Factor Weights**: Assumes constant contribution ratios (reality more complex)
3. **No Breakthrough Dynamics**: Doesn't model sudden algorithmic breakthroughs
4. **Independent Factors**: Doesn't fully capture interdependencies (e.g., capital enabling compute)
5. **Quality vs Quantity**: Treats all compute/talent as equal (quality varies)
6. **No Geopolitical Shocks**: Assumes continuous progress without major disruptions

## Research Sources

Model parameters derived from:
- Nvidia production data (2024-2025)
- CSET Georgetown AI talent research
- Council on Foreign Relations export control analysis
- IEA energy consumption reports
- Stanford HAI investment tracking
- SemiAnalysis chip production estimates

## Future Enhancements

Potential improvements:
- Add algorithmic efficiency as a fifth factor
- Model quality-adjusted compute (not just quantity)
- Include international collaboration/competition dynamics
- Add geopolitical risk scenarios
- Integrate with real-time data sources
- Stan/PyMC3 backend for full Bayesian inference

## License

Educational and research use. Not for policy decisions without expert validation.

## Contact

For questions about methodology or data sources, see the embedded documentation in `ai_policy_simulation.py`.
