# ⚡ Energy: Data Center Power & Infrastructure

## Recent Data & Projections (2024-2025)

### US Total Electricity Generation

**2024 Actual Performance:**
- Total US electricity generation: **4,097 TWh** ([EIA 2025 projections](https://www.eia.gov/outlooks/aeo/))
- Year-over-year growth: **+3.0%** (+128 TWh from 2023), marking the fifth highest annual growth this century
- Historical context: This represents a significant acceleration from the near-flat growth (0.5-1% annually) seen during 2008-2021
- Growth drivers: Data center expansion, AI workloads, weather patterns, and broader economic activity

**EIA Annual Energy Outlook 2025 Projections:**
- **2025**: 4,419 TWh baseline
- **2030**: ~4,800 TWh (implied ~1.7% annual growth)
- **2050**: 6,646 TWh (50% increase from 2025, representing ~1.6% compound annual growth)

**Data Center-Specific Projections (EIA AEO 2025):**
- Data center electricity use projected to increase **+90 TWh by 2030** and **+440 TWh by 2050** above 2022 baseline
- Commercial computing will grow from 8% of commercial sector electricity in 2024 to **20% by 2050**
- Data centers projected to reach **10-12% of total US generation by 2028-2030**, up from ~4% in 2024

### Key Insight: The Growing Gap

The critical tension in US energy for AI:
- **Total grid growth**: 1.5-2.5% annually (population, electrification, general economy)
- **Datacenter growth**: 15-20% annually (AI training, cloud migration, edge computing)
- **Implication**: Datacenters growing 7-10x faster than overall grid capacity

This creates a **closing window** where unconstrained datacenter expansion (2024-2027) transitions to grid-constrained competition for power (2028-2030+), making the grid saturation threshold (~10% of total generation) a critical parameter for AI policy modeling.

## United States

US data centers consumed [about 183 TWh in 2024, more than 4% of national electricity consumption](https://www.ciphernews.com/articles/the-u-s-and-china-drive-data-center-power-consumption/). AI-specific servers used an estimated [53-76 TWh in 2024, with projections of 165-326 TWh by 2028](https://research.aimultiple.com/ai-energy-consumption/), representing 30% annual growth driven by AI adoption.

Total data center power consumption is projected to grow dramatically: [power consumption will increase 130% to 425 TWh by 2030](https://www.ciphernews.com/articles/the-u-s-and-china-drive-data-center-power-consumption/) compared to 2024 levels. [GPT-4 training alone consumed about 50 GWh](https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai), illustrating the massive energy requirements for frontier models.

Infrastructure constraints are emerging. [Data centers are seeking more reliable, cleaner energy solutions as generative AI demands increase](https://www.deloitte.com/us/en/insights/industry/technology/technology-media-and-telecom-predictions/2025/genai-power-consumption-creates-need-for-more-sustainable-data-centers.html), and [a crisis looms in power consumption for AI data centers](https://semiengineering.com/crisis-ahead-power-consumption-in-ai-data-centers/) without significant grid investments.

**Model Parameters:** Starting capacity of 183 TWh for data centers, 15% annual growth rate reflecting infrastructure buildout but facing constraints, 80% constraint factor representing emerging grid limitations and permitting challenges for new power facilities.

## China

China's data center energy consumption represents a significant share of global usage. [China accounted for 25% of global data-centre electricity consumption in 2024](https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai), with power consumption projected to [increase 170% to 277 TWh by 2030](https://www.carbonbrief.org/explainer-how-china-is-managing-the-rising-energy-demand-from-data-centres/).

Starting from approximately 104 TWh in 2024, [China faces challenges powering its data centre expansion](https://www.woodmac.com/blogs/the-edge/powering-chinas-data-centres/) amid broader energy transition goals. [China and the US are in a race to generate power for AI data centers as electricity demand soars](https://techblog.comsoc.org/2026/02/16/china-vs-u-s-generating-power-for-ai-data-centers-as-demand-soars/).

[Questions remain about whether China's energy system is ready for the AI boom](https://www.eco-business.com/opinion/is-chinas-energy-system-ready-for-the-ai-boom/), particularly given regional power constraints and coal dependency. However, China's centralized planning may enable faster infrastructure deployment than market-based US approaches.

Together, [the United States and China account for nearly 80% of the projected growth in electricity consumption from data centers by the end of the decade](https://www.ciphernews.com/articles/the-u-s-and-china-drive-data-center-power-consumption/).

**Model Parameters:** Starting capacity of 104 TWh for data centers, 20% annual growth rate reflecting aggressive infrastructure investment and centralized planning advantages, 70% constraint factor representing regional power constraints, grid stability concerns, and environmental policy tensions.

## Understanding Energy Growth Rates

### Datacenter Energy vs Total Grid Growth

An important nuance: **this simulation models datacenter energy consumption, not total electricity generation.**

**Overall Grid Growth (Baseline Economic Growth)**:
- **US**: [EIA forecasts 2-2.5% annual growth in total electricity generation through 2050](https://www.eia.gov/outlooks/aeo/), driven by population growth, electrification of transport, and industrial demand
- **China**: [5-7% annual growth in total power generation capacity](https://www.iea.org/countries/china), slowing from historical 8-10% as economy matures

**Datacenter-Specific Growth (AI/Cloud Boom)**:
- **US**: 15-20% annual growth in datacenter energy consumption, 5-10x faster than overall grid
- **China**: 18-20% annual growth in datacenter energy consumption, 3-4x faster than overall grid

### Why Datacenter Growth Outpaces Grid Growth

1. **AI Training Boom**: Frontier model training requirements doubling every 6-12 months
2. **Cloud Migration**: Enterprises moving computing to hyperscale datacenters
3. **Cryptocurrency**: Mining operations (though less relevant for AI-specific analysis)
4. **5G/IoT**: Edge computing and data processing infrastructure
5. **Efficiency Gains Exhausted**: PUE (Power Usage Effectiveness) improvements plateauing at ~1.2

### The Tension: Growth Rates vs Physical Constraints

Our 15-20% datacenter growth assumptions are **aspirational but physically challenging**:

**What enables high growth**:
- Datacenter construction can scale faster than grid (12-24 months vs 5-10 years for power plants)
- Capital abundance in tech sector for rapid buildout
- Concentrated demand in specific regions with available power

**What constrains high growth**:
- **Grid saturation**: Datacenters approaching 10-12% of total US generation by 2028-2030
- **Permitting bottlenecks**: New power plants (especially nuclear) face 5-10 year timelines
- **Regional limits**: Northern Virginia (Loudoun County) already uses 25-30% of regional grid for datacenters
- **Renewable intermittency**: Solar/wind growth doesn't provide 24/7 baseload for training runs

### How Constraints Work in the Model

The `energy_constraint` parameter (0.80 for US, 0.70 for China) represents these physical limits:

```python
# Energy can grow at 15-20% per year in theory
year_mean = mean * ((1 + 0.15) ** year)

# But constraint caps maximum achievable
max_theoretical = year_mean * 3
max_constrained = max_theoretical * 0.80  # Can only achieve 80% of optimistic ceiling
```

This means:
- **Early years (2024-2027)**: Growth tracks 15-20% as planned datacenters come online
- **Middle years (2027-2030)**: Constraints bite as datacenter share hits 8-12% of grid
- **Later years (2030+)**: Growth limited by grid expansion pace, falls toward 5-8%

## Upper Limits on US Total Energy Growth (2025-2035)

### Maximum Feasible Build-Out Rates

Understanding the **ceiling** on US electricity generation growth requires examining both historical precedents and current physical/institutional constraints:

**Historical Maximum Growth Rates:**
- **1950s-1960s**: 8-10% annual growth, adding ~40 TWh/year (but from a much smaller base)
- **1970s peak**: ~100 TWh/year absolute additions at 4-5% growth rates
- **2024**: 128 TWh added (+3.0% growth), marking the **fifth highest annual growth this century**

**Near-Term Capacity Projections (2025-2030):**
- **Planned additions**: [226 GW wind/solar, 100 GW gas, 68 GW batteries through 2035](https://www.publicpower.org/system/files/documents/Americas-Electricity-Generation-Capacity-2025-Update.pdf)
- **Interconnection agreements**: [Record 75 GW secured in 2024, 36 GW through July 2025](https://emp.lbl.gov/publications/queued-2025-edition-characteristics)
- **Realistic annual capacity additions**: 50-70 GW/year nameplate (20-30 GW effective with capacity factors)

### Physical and Institutional Constraints

**1. Interconnection Queue Bottleneck**
- **Current backlog**: 1,400 GW generation + 890 GW storage seeking interconnection as of end-2024
- **Historical completion rate**: Only 13% of projects requesting interconnection (2000-2019) reached commercial operation by 2024; 77% withdrawn
- **Queue wait times**: Median time from interconnection request to commercial operation doubled from <2 years (2000-2007) to >4 years (2018-2024)
- **Implication**: Even with unlimited capital and demand, physical grid connection processes limit how fast new generation can come online

**2. Construction Timeline Constraints by Technology**
- **Solar/Wind**: 4 years average (permitting + siting + construction)
- **Natural gas combined-cycle**: 3-4 years, but capital costs doubled from $1,200/kW (2022) to $2,500-2,800/kW (2025) due to supply chain tightening
- **Nuclear**: 8-15 years for traditional plants; 5-8 years for small modular reactors (SMRs) in optimistic scenarios
- **Transmission lines**: ~10 years to complete, substantially longer than generation projects

**3. Supply Chain and Labor Constraints**
- **Turbine supply tightening**: CCGT new builds constrained by equipment availability
- **EPC (Engineering, Procurement, Construction) bandwidth**: Limited number of qualified firms to execute large projects
- **Labor markets**: Competitive demand for skilled workers across construction, electrical, and engineering trades
- **Trade/tariff impacts**: 2025 tariff measures increased costs and uncertainty, slowing procurement

**4. Renewable Intermittency and Storage Limits**
- **Capacity factor reality**: Solar ~25%, Wind ~35% means 100 GW nameplate = 25-35 GW effective baseload
- **Battery storage**: 68 GW planned through 2035, but provides hours (not days) of backup
- **AI datacenter needs**: Require 24/7 baseload power, making renewables alone insufficient without massive storage buildout

### Synthesis: Maximum US Generation Growth 2025-2035

**Optimistic High-Demand Scenario:**
If AI/datacenter demand materializes as projected, what is the **maximum feasible** US electricity generation growth?

**2025-2030 (Unconstrained Demand Period):**
- **Annual additions**: 80-120 TWh/year (matching or slightly exceeding 1970s peak)
- **Percentage growth**: 2.0-2.8% annually (from 4,100 TWh base in 2025)
- **Cumulative total by 2030**: 4,600-4,900 TWh (vs. EIA baseline of 4,800 TWh)
- **Limiting factors**: Interconnection queues, permitting delays, supply chain constraints

**2030-2035 (Infrastructure-Constrained Period):**
- **Annual additions**: 60-100 TWh/year (declining as easy projects exhaust, transmission limits bind)
- **Percentage growth**: 1.3-2.0% annually (from 4,800 TWh base in 2030)
- **Cumulative total by 2035**: 5,100-5,400 TWh
- **Limiting factors**: Transmission buildout lags, renewable integration challenges, nuclear deployment delays

**Maximum 10-Year Growth (2025-2035):**
- **Absolute ceiling**: +1,000-1,300 TWh over baseline (25-30% total growth)
- **Compound annual growth rate**: 2.3-2.7% (significantly above 2008-2021 average of 0.5-1%, but below 1970s)
- **Total generation by 2035**: ~5,400 TWh in highest plausible scenario

**Comparison to Demand Projections:**
- **Data center demand growth**: 15-20% annually → 425 TWh by 2030 (from 183 TWh in 2024)
- **Total generation growth**: 2.3-2.7% annually → ~5,400 TWh by 2035
- **Implication**: Datacenters could consume 8-10% of total US generation by 2030, creating severe competition with other electrification (EVs, heat pumps, industrial)

### Key Insight: The Hard Ceiling

The US faces a **hard physical ceiling** on electricity growth of approximately **2.5-3.0% annually** even under conditions of unlimited demand and capital. This ceiling is determined by:

1. **Interconnection queue throughput**: ~75 GW/year of agreements at current record pace
2. **Construction industry capacity**: ~50-70 GW/year of actual completions based on labor, supply chain, permitting
3. **Transmission development lag**: Cannot expand grid backbone fast enough to support distributed generation

This means that datacenter growth at 15-20% annually is **fundamentally incompatible** with total grid growth at 2.5-3.0% annually beyond ~2028, when datacenters would exceed grid's ability to dedicate capacity.

### Policy Implications

The gap between datacenter demand growth (15-20%) and grid capacity growth (2.5-3.0% maximum) creates a **closing window**:

1. **2024-2027**: Abundant energy for AI training expansion
2. **2027-2030**: Regional constraints emerge, competition for power capacity intensifies
3. **2030+**: Energy becomes primary bottleneck unless major grid investments succeed

This makes **near-term policy** (2024-2027) critical for locking in AI infrastructure before energy constraints bind. Export controls that delay China's chip deployment by 2-3 years may be especially impactful if they push China's scaling plans into the energy-constrained period.

**The hard ceiling on US generation growth (~3% annually) means that datacenter expansion beyond 10-12% of total grid share will require either:**
- Dramatic efficiency improvements in AI compute (unlikely given scaling laws)
- Displacement of other electricity uses (residential, commercial, industrial)
- Co-location with dedicated power sources (on-site nuclear, gas plants) that bypass grid interconnection queues
- Slowdown in AI scaling ambitions
