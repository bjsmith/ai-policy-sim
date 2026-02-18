# 🔬 Simulation Methodology

## Dual Measurement Approach

This simulation tracks AI progress using two complementary metrics:

### 1. Progress Index (Qualitative Capability)

A composite measure of overall AI capability using a Cobb-Douglas production function:

```
Progress = (Compute^0.40) × (Capital^0.25) × (Talent^0.25) × (Energy^0.10) × Learning_Effect
```

This represents the **quality and sophistication** of AI systems - their ability to solve complex tasks, generalize across domains, and approach human-level reasoning.

**Key Features:**
- Baseline of 100 = current frontier (2024-2025)
- Logarithmic learning effects (progress builds on previous achievements)
- Diminishing returns from each factor
- Captures algorithmic improvements and research breakthroughs

### 2. Training Compute Capacity (Quantitative Resource)

The annual budget of FLOPS (floating-point operations) available for training new frontier models:

```
Annual_Training_Capacity =
    Deployed_Chips ×
    Utilization_Rate ×
    FLOPS_per_Chip ×
    Seconds_per_Year ×
    Energy_Constraint_Multiplier
```

This represents the **quantity of computation** that can be devoted to training - the raw resource constraint on model development.

## Training Capacity Calculation Details

### Base Parameters

**Chip Performance (H100 baseline)**
- [Theoretical peak: ~1,000 TFLOPS (FP8/TF32 tensor operations)](https://www.nvidia.com/en-us/data-center/h100/)
- [Mixed precision training: ~500-1,000 TFLOPS effective depending on precision](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/)
- Tensor core utilization: 60-80% in practice (estimated from deployment experience)

**Utilization Rates**
- US: 40% of chips actively training at any given time
  - Remaining: 30% inference, 20% idle/development, 10% maintenance
- China: 35% training utilization
  - Lower due to less efficient cluster orchestration and power reliability

**Time**
- 8,760 hours per year
- 31,536,000 seconds per year
- Training runs: typically 1-6 months for frontier models

### Energy Constraint Model

Energy acts as a **secondary constraint** that only binds when chip deployment outpaces power infrastructure:

```python
# Energy required for theoretical max training
Energy_Required_TWh = (
    Chips × 1M ×
    350W_TDP ×
    Utilization_Rate ×
    8760_hours /
    1e12  # Convert to TWh
)

# Energy available for AI training
Energy_Available_TWh = (
    Total_Datacenter_Energy ×
    Training_Fraction  # 30-50% of datacenter energy
)

# Constraint multiplier
Energy_Multiplier = min(1.0, Energy_Available / Energy_Required)
```

### When Energy Constrains

**Current Status (2024-2025)**:
- **US**: Energy NOT yet constraining
  - Has 183 TWh datacenter capacity
  - AI training uses ~50-75 TWh (27-41%)
  - Grid can support 50%+ growth for 2-3 more years

- **China**: REGIONAL constraints emerging
  - Has 104 TWh datacenter capacity
  - Some provinces face power reliability issues
  - Coal dependency creates regional bottlenecks
  - National capacity sufficient, but distribution uneven

**Future Scenarios Where Energy Binds**:
1. **Exponential chip growth**: If chips grow 50%/year but energy only 15%/year, energy becomes bottleneck by 2027-2028
2. **Environmental regulations**: Carbon limits or permitting delays slow power plant construction
3. **Regional concentration**: Building mega-clusters in specific locations overwhelms local grids
4. **Competing demand**: Industrial/residential demand grows faster than supply

### Example Calculation (US 2024)

```
Deployed chips: 3.5M H100-equivalent
Utilization rate: 0.4 (40%)
FLOPS per chip: 1,000 TFLOPS = 1e15 ops/sec
Seconds per year: 3.15e7

Theoretical capacity = 3.5e6 × 0.4 × 1e15 × 3.15e7
                     = 4.41e28 FLOPS per year
                     = 44.1 YottaFLOPS-years

Energy required = 3.5M × 350W × 0.4 × 8760h = 4.3 TWh
Energy available = 183 TWh × 0.4 = 73.2 TWh
Energy multiplier = min(1.0, 73.2 / 4.3) = 1.0 (no constraint)

Actual capacity = 4.41e28 FLOPS-years (unconstrained)
```

### Converting to Model Equivalents

To make these numbers intuitive:

**Training compute for major models**:
- [GPT-3 (2020): ~3.14×10²³ FLOPS](https://epochai.org/data/epochdb/notable_ai_models/GPT-3) (~0.003 YottaFLOPS)
- [GPT-4 (2023): ~2.15×10²⁵ FLOPS](https://epoch.ai/data-insights/models-over-1e25-flop) (~0.2 YottaFLOPS)
- Hypothetical GPT-5: ~2×10²⁶ FLOPS (~2 YottaFLOPS, extrapolated from scaling trends)

With 44.1 YottaFLOPS-years capacity, the US could theoretically train:
- ~140,000 GPT-3 class models per year, OR
- ~220 GPT-4 class models per year, OR
- ~22 hypothetical GPT-5 class models per year

In reality, organizations train far fewer models due to:
- Algorithmic research taking time (not just compute)
- Talent limitations (need teams to design/train models)
- Capital costs (compute must be purchased/rented)
- Experimentation overhead (many failed training runs)

## Why Both Metrics Matter

### Progress Index captures:
- Algorithmic efficiency improvements
- Talent quality effects
- Synergies between factors
- Path dependency and learning

### Training Capacity captures:
- Hard resource constraints
- Policy intervention impacts (export controls)
- Infrastructure bottlenecks
- Direct comparison to known benchmarks

### Example Policy Analysis

**Scenario: Strict export controls reducing China's chip access by 50%**

**Progress Index impact**: -15%
- Chips contribute 40% weight, but logarithmic diminishing returns
- Talent and capital partially compensate
- Learning effects cushion the blow

**Training Capacity impact**: -50%
- Direct linear relationship to chip count
- Immediately visible constraint
- Cannot be compensated by other factors

This shows export controls have **immediate quantitative impact** (training capacity) but **slower qualitative impact** (progress) as other factors partially compensate.

## Model Limitations

1. **Simplifies algorithmic progress**: Assumes steady improvement, but breakthroughs are lumpy
2. **Ignores model architecture evolution**: Future models may be more/less compute-efficient
3. **Assumes fixed utilization**: Reality varies by organization and infrastructure maturity
4. **National aggregation**: Doesn't model individual companies or labs
5. **Energy is proxy**: Real constraint is often power delivery (MW) not energy (MWh)

Despite these limitations, the dual-metric approach provides useful bounds on plausible futures under different policy scenarios.
