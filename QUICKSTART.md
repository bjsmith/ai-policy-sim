# Quick Start Guide

## Running the Simulation

```bash
cd ai-policy-sim
./run.sh
```

Then open: **http://localhost:5000**

## What You'll See

### Interactive Controls (Left Sidebar)
- **US Parameters**: Adjust compute, capital, talent, and energy for the United States
- **China Parameters**: Same factors for China
- Each factor has three controls:
  - **Current Capacity**: Starting value (2024-2025 baseline)
  - **Growth Rate**: Annual percentage increase
  - **Policy Constraint**: 0-100% (how much policy limits the factor)

### Visualization (Main Area)
- **Progress Chart**: Shows frontier AI development over 10 years
- **Uncertainty Bands**: 25th-75th percentile ranges
- **Factor Analysis Tab**: Individual charts for each of the four factors

### Key Metrics (Top Cards)
- **Catch-up Probability**: % chance China reaches 90% of US progress
- **Surpass Probability**: % chance China exceeds US progress
- **Final Progress Values**: Median outcomes at year 10

## Example Scenarios to Try

### 1. Baseline (Default)
Just click "Run Simulation" to see current trajectory based on 2024-2025 data.

**Expected Result**: US maintains significant lead (~400 vs ~115 progress index)

### 2. Stricter Export Controls
- Set China compute constraint to **0.25** (from 0.45)
- Click "Run Simulation"

**Expected Result**: Wider gap, catch-up probability drops significantly

### 3. China Breakthrough in Domestic Chips
- Set China compute mean to **1.5** (from 0.6)
- Set China compute growth to **0.60** (from 0.35)
- Set China compute constraint to **0.70** (from 0.45)
- Click "Run Simulation"

**Expected Result**: Gap narrows, catch-up probability increases substantially

### 4. Energy Crisis
- Set US energy constraint to **0.50** (from 0.80)
- Set US energy growth to **0.05** (from 0.15)
- Click "Run Simulation"

**Expected Result**: US progress slows due to infrastructure bottleneck

### 5. Immigration Reform Boosts US Talent
- Set US talent mean to **90** (from 63)
- Set US talent constraint to **0.95** (from 0.85)
- Click "Run Simulation"

**Expected Result**: US lead increases due to talent advantage

### 6. AI Investment Boom
- Set both US and China capital growth to **0.50** (from 0.30 and 0.25)
- Click "Run Simulation"

**Expected Result**: Both countries progress faster, relative gap may stay similar

## Understanding the Model

### Progress Formula
```
Progress = (Compute^40%) × (Capital^25%) × (Talent^25%) × (Energy^10%) × Learning
```

### Factor Weights
- **Compute (40%)**: Most critical - advanced chips are the primary bottleneck
- **Capital (25%)**: Enables everything else - investment drives progress
- **Talent (25%)**: Critical for efficiency - researchers create breakthroughs
- **Energy (10%)**: Enabling but less constraining currently

### What "Constraint" Means
Think of it as policy effectiveness:
- **1.0 (100%)**: No constraints - market operates freely
- **0.5 (50%)**: Policy cuts available resources in half
- **0.0 (0%)**: Complete blockade - no access

Examples:
- China compute at 0.45 = Export controls limit access to ~45% of what they'd otherwise achieve
- US talent at 0.85 = Immigration/education constraints limit to 85% of theoretical max

## Tips for Exploration

1. **Start with one change**: Adjust one parameter at a time to see its isolated effect
2. **Compare scenarios**: Run baseline first, then modify to compare
3. **Extreme scenarios**: Try extreme values (0.0 or 1.0) to understand bounds
4. **Combined effects**: Test policy combinations (e.g., export controls + energy limits)
5. **Look at uncertainty**: Wide bands = high uncertainty in that scenario

## Technical Notes

- **200 samples per run**: Each simulation generates 200 probabilistic scenarios
- **10-year horizon**: Default projection period
- **Percentiles**: p25-p75 bands show likely range, p50 is median
- **Run time**: ~2-5 seconds per simulation on modern hardware

## Troubleshooting

**Port already in use?**
```bash
# Kill any existing Flask process
lsof -ti:5000 | xargs kill -9
./run.sh
```

**Dependencies missing?**
```bash
source ../venv/bin/activate  # or create new venv
pip install -r requirements.txt
```

**Charts not showing?**
- Check browser console (F12) for JavaScript errors
- Make sure you clicked "Run Simulation" after changing parameters

## Next Steps

- Read the full [README.md](README.md) for methodology details
- Examine [ai_policy_simulation.py](ai_policy_simulation.py) for model implementation
- Modify factor weights in the code to test different assumptions
- Add your own scenarios to explore specific policy questions
