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

### Policy Implications

The gap between datacenter demand growth (15-20%) and grid capacity growth (2-7%) creates a **closing window**:

1. **2024-2027**: Abundant energy for AI training expansion
2. **2027-2030**: Regional constraints emerge, competition for power capacity
3. **2030+**: Energy becomes primary bottleneck unless major grid investments succeed

This makes **near-term policy** (2024-2027) critical for locking in AI infrastructure before energy constraints bind. Export controls that delay China's chip deployment by 2-3 years may be especially impactful if they push China's scaling plans into the energy-constrained period.
