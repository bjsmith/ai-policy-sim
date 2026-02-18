# 📊 Overall Model Synthesis

This simulation synthesizes the four factors using a Cobb-Douglas production function weighted by empirical importance to frontier AI development:

- **Compute (40%)**: Most critical factor—advanced GPUs are the primary bottleneck for frontier models
- **Capital (25%)**: Enables all other factors through investment in infrastructure, talent, and compute
- **Talent (25%)**: Critical for research breakthroughs and efficient use of compute resources
- **Energy (10%)**: Enabling but currently less constraining than other factors

Each factor includes three parameters: baseline capacity (current state), growth rate (annual increase), and constraint factor (policy/infrastructure limitations). The model uses Monte Carlo sampling with 200 scenarios to capture uncertainty, with log-normal distributions reflecting realistic economic and technical dynamics.

**Key Assumption:** Progress builds cumulatively over time with learning effects, but constraints can significantly limit what would otherwise be achievable. Policy interventions (export controls, immigration reform, energy infrastructure investment) directly affect constraint parameters.
