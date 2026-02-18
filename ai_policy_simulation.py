"""
US-China AI Policy Simulation
A probabilistic, longitudinal model for frontier AI development
"""

import numpy as np
from dataclasses import dataclass
from typing import Dict, List, Tuple
import json


@dataclass
class CountryParams:
    """Parameters for a country's AI development factors"""
    # Compute (in equivalent H100 GPUs, millions)
    compute_mean: float
    compute_std: float
    compute_growth_rate: float  # Annual growth rate
    compute_constraint: float  # Max capacity constraint (0-1, where 1 = no constraint)

    # Capital (in billions USD)
    capital_mean: float
    capital_std: float
    capital_growth_rate: float
    capital_constraint: float

    # Talent (in thousands of AI researchers)
    talent_mean: float
    talent_std: float
    talent_growth_rate: float
    talent_constraint: float

    # Energy (in TWh available for AI)
    energy_mean: float
    energy_std: float
    energy_growth_rate: float
    energy_constraint: float

    # Optional: Two-phase energy model parameters
    energy_growth_unconstrained: float = None  # Initial growth rate (datacenter expansion)
    energy_growth_grid: float = None  # Grid-limited growth rate
    total_generation: float = None  # Total electricity generation capacity
    grid_threshold: float = None  # Saturation threshold (% of total generation)


class AIProgressSimulation:
    """
    Monte Carlo simulation of AI frontier model development

    The model assumes progress is a multiplicative function of the four factors,
    with each factor contributing based on empirical evidence.
    """

    def __init__(self, us_params: CountryParams, china_params: CountryParams,
                 years: int = 10, samples: int = 100):
        self.us_params = us_params
        self.china_params = china_params
        self.years = years
        self.samples = samples

        # Contribution weights (based on AI research suggesting compute is most critical)
        self.weights = {
            'compute': 0.40,      # Compute is the primary bottleneck
            'capital': 0.25,      # Capital enables everything else
            'talent': 0.25,       # Talent is crucial for efficiency
            'energy': 0.10        # Energy is enabling but less constraining currently
        }

    def _sample_factor(self, mean: float, std: float, growth_rate: float,
                      constraint: float, year: int, is_energy: bool = False) -> np.ndarray:
        """
        Sample a factor value for a given year across all Monte Carlo samples

        Args:
            mean: Base mean value
            std: Standard deviation
            growth_rate: Annual growth rate (e.g., 0.15 for 15%)
            constraint: Policy/infrastructure constraint (0-1)
            year: Year index (0-based)
            is_energy: If True, use simple growth model (two-phase handled separately)

        Returns:
            Array of sampled values for this factor
        """
        # Apply growth with some uncertainty
        growth_uncertainty = np.random.normal(0, 0.02, self.samples)
        effective_growth = growth_rate + growth_uncertainty

        # Calculate mean value for this year
        year_mean = mean * ((1 + effective_growth) ** year)
        year_std = std * ((1 + effective_growth) ** year)

        # Sample from log-normal distribution (realistic for economic/tech factors)
        log_mean = np.log(year_mean ** 2 / np.sqrt(year_mean ** 2 + year_std ** 2))
        log_std = np.sqrt(np.log(1 + year_std ** 2 / year_mean ** 2))

        samples = np.random.lognormal(log_mean, log_std, self.samples)

        # Apply constraint (e.g., export controls, energy limits)
        # Constraint reduces the maximum achievable value
        max_theoretical = year_mean * 3  # Optimistic upper bound
        max_constrained = max_theoretical * constraint
        samples = np.minimum(samples, max_constrained)

        return samples

    def _sample_energy_twophase(self, params: CountryParams, year: int, prev_energy: np.ndarray = None) -> np.ndarray:
        """
        Sample energy using two-phase growth model:
        - Phase 1 (unconstrained): High growth as planned datacenters come online
        - Phase 2 (grid-constrained): Lower growth limited by grid expansion
        Transition happens when datacenter usage hits threshold % of total generation

        Args:
            params: Country parameters with energy model settings
            year: Year index (0-based)
            prev_energy: Previous year's energy values (for monotonic constraint)

        Returns:
            Array of sampled energy values that always increase from prev_energy
        """
        if year == 0:
            # Year 0: Just sample around the mean with uncertainty
            uncertainty = np.random.normal(1.0, params.energy_std / params.energy_mean, self.samples)
            samples = params.energy_mean * uncertainty
            return np.maximum(samples, params.energy_mean * 0.8)  # Floor at 80% of mean

        # Use two-phase model if parameters are available
        if params.energy_growth_unconstrained is not None and params.total_generation is not None:
            # Calculate threshold in TWh
            threshold_twh = params.total_generation * params.grid_threshold

            # Determine which phase each sample is in based on previous year
            phase_1_mask = prev_energy < threshold_twh
            phase_2_mask = ~phase_1_mask

            # Initialize next year's energy
            next_energy = np.zeros(self.samples)

            # Phase 1: Unconstrained growth (datacenter expansion)
            if np.any(phase_1_mask):
                growth_1 = np.random.normal(params.energy_growth_unconstrained, 0.02, self.samples)
                next_energy[phase_1_mask] = prev_energy[phase_1_mask] * (1 + growth_1[phase_1_mask])

            # Phase 2: Grid-constrained growth
            if np.any(phase_2_mask):
                growth_2 = np.random.normal(params.energy_growth_grid, 0.015, self.samples)
                next_energy[phase_2_mask] = prev_energy[phase_2_mask] * (1 + growth_2[phase_2_mask])

            # Ensure we never exceed total generation capacity (hard ceiling)
            next_energy = np.minimum(next_energy, params.total_generation * 0.95)

        else:
            # Fallback to simple growth model
            growth = np.random.normal(params.energy_growth_rate, 0.02, self.samples)
            next_energy = prev_energy * (1 + growth)

        # CRITICAL: Ensure monotonic increase (energy never decreases)
        next_energy = np.maximum(next_energy, prev_energy * 1.01)  # Minimum 1% growth

        return next_energy

    def _calculate_progress(self, compute: np.ndarray, capital: np.ndarray,
                           talent: np.ndarray, energy: np.ndarray,
                           previous_progress: np.ndarray) -> np.ndarray:
        """
        Calculate frontier AI progress based on the four factors

        Progress is measured as a composite index (baseline 100 = current frontier)
        Each factor contributes multiplicatively with diminishing returns
        """
        # Normalize factors relative to baseline (current US levels)
        # This creates an index where 1.0 = current capability

        # Apply Cobb-Douglas style production function with weights
        # P = A * (Compute^α) * (Capital^β) * (Talent^γ) * (Energy^δ)
        # where α + β + γ + δ = 1

        progress = (
            (compute ** self.weights['compute']) *
            (capital ** self.weights['capital']) *
            (talent ** self.weights['talent']) *
            (energy ** self.weights['energy'])
        )

        # Add path dependency - previous progress matters (learning effects)
        # Progress builds on itself but with diminishing returns
        cumulative_effect = 1 + 0.1 * np.log1p(previous_progress)
        progress = progress * cumulative_effect

        return progress

    def _calculate_training_capacity(self, compute: np.ndarray, energy: np.ndarray,
                                     is_china: bool = False) -> np.ndarray:
        """
        Calculate annual training compute capacity in YottaFLOPS-years

        Args:
            compute: Number of H100-equivalent GPUs (in millions)
            energy: Available datacenter energy (in TWh)
            is_china: Whether this is for China (affects utilization rate)

        Returns:
            Training capacity in YottaFLOPS-years (1e24 FLOPS-years)
        """
        # Constants
        UTILIZATION_RATE = 0.35 if is_china else 0.40  # Lower utilization for China
        FLOPS_PER_CHIP = 1e15  # 1000 TFLOPS effective for H100
        SECONDS_PER_YEAR = 3.15e7
        TRAINING_FRACTION = 0.4  # 40% of datacenter energy goes to training

        # Theoretical max from chips (in FLOPS-years)
        theoretical_capacity = (
            compute * 1e6 *  # Convert millions to actual number
            UTILIZATION_RATE *
            FLOPS_PER_CHIP *
            SECONDS_PER_YEAR
        )

        # Energy required for theoretical max (in TWh)
        # H100 TDP: 350W, running at utilization rate
        energy_required = (
            compute * 1e6 *
            350e-12 *  # 350W in TW
            UTILIZATION_RATE *
            8760  # hours per year
        )

        # Energy available for training
        energy_available = energy * TRAINING_FRACTION

        # Calculate energy constraint multiplier
        energy_multiplier = np.minimum(1.0, energy_available / energy_required)

        # Apply energy constraint
        actual_capacity = theoretical_capacity * energy_multiplier

        # Convert to YottaFLOPS-years (1e24 FLOPS) for readability
        capacity_yottaflops = actual_capacity / 1e24

        return capacity_yottaflops

    def run_simulation(self) -> Dict[str, np.ndarray]:
        """
        Run the full Monte Carlo simulation

        Returns:
            Dictionary with time series of progress distributions for both countries
        """
        # Initialize results arrays
        us_progress = np.zeros((self.years, self.samples))
        china_progress = np.zeros((self.years, self.samples))

        us_training_capacity = np.zeros((self.years, self.samples))
        china_training_capacity = np.zeros((self.years, self.samples))

        us_compute_ts = np.zeros((self.years, self.samples))
        us_capital_ts = np.zeros((self.years, self.samples))
        us_talent_ts = np.zeros((self.years, self.samples))
        us_energy_ts = np.zeros((self.years, self.samples))

        china_compute_ts = np.zeros((self.years, self.samples))
        china_capital_ts = np.zeros((self.years, self.samples))
        china_talent_ts = np.zeros((self.years, self.samples))
        china_energy_ts = np.zeros((self.years, self.samples))

        # Run simulation year by year
        for year in range(self.years):
            # Sample US factors
            us_compute = self._sample_factor(
                self.us_params.compute_mean,
                self.us_params.compute_std,
                self.us_params.compute_growth_rate,
                self.us_params.compute_constraint,
                year
            )
            us_capital = self._sample_factor(
                self.us_params.capital_mean,
                self.us_params.capital_std,
                self.us_params.capital_growth_rate,
                self.us_params.capital_constraint,
                year
            )
            us_talent = self._sample_factor(
                self.us_params.talent_mean,
                self.us_params.talent_std,
                self.us_params.talent_growth_rate,
                self.us_params.talent_constraint,
                year
            )
            # Use two-phase energy model
            prev_us_energy = us_energy_ts[year-1] if year > 0 else None
            us_energy = self._sample_energy_twophase(self.us_params, year, prev_us_energy)

            # Sample China factors
            china_compute = self._sample_factor(
                self.china_params.compute_mean,
                self.china_params.compute_std,
                self.china_params.compute_growth_rate,
                self.china_params.compute_constraint,
                year
            )
            china_capital = self._sample_factor(
                self.china_params.capital_mean,
                self.china_params.capital_std,
                self.china_params.capital_growth_rate,
                self.china_params.capital_constraint,
                year
            )
            china_talent = self._sample_factor(
                self.china_params.talent_mean,
                self.china_params.talent_std,
                self.china_params.talent_growth_rate,
                self.china_params.talent_constraint,
                year
            )
            # Use two-phase energy model
            prev_china_energy = china_energy_ts[year-1] if year > 0 else None
            china_energy = self._sample_energy_twophase(self.china_params, year, prev_china_energy)

            # Store factor values
            us_compute_ts[year] = us_compute
            us_capital_ts[year] = us_capital
            us_talent_ts[year] = us_talent
            us_energy_ts[year] = us_energy

            china_compute_ts[year] = china_compute
            china_capital_ts[year] = china_capital
            china_talent_ts[year] = china_talent
            china_energy_ts[year] = china_energy

            # Calculate progress
            prev_us = us_progress[year-1] if year > 0 else np.ones(self.samples)
            prev_china = china_progress[year-1] if year > 0 else np.ones(self.samples)

            us_progress[year] = self._calculate_progress(
                us_compute, us_capital, us_talent, us_energy, prev_us
            )
            china_progress[year] = self._calculate_progress(
                china_compute, china_capital, china_talent, china_energy, prev_china
            )

            # Calculate training capacity
            us_training_capacity[year] = self._calculate_training_capacity(
                us_compute, us_energy, is_china=False
            )
            china_training_capacity[year] = self._calculate_training_capacity(
                china_compute, china_energy, is_china=True
            )

        return {
            'us_progress': us_progress,
            'china_progress': china_progress,
            'us_training_capacity': us_training_capacity,
            'china_training_capacity': china_training_capacity,
            'us_compute': us_compute_ts,
            'us_capital': us_capital_ts,
            'us_talent': us_talent_ts,
            'us_energy': us_energy_ts,
            'china_compute': china_compute_ts,
            'china_capital': china_capital_ts,
            'china_talent': china_talent_ts,
            'china_energy': china_energy_ts,
        }

    def get_summary_statistics(self, results: Dict[str, np.ndarray]) -> Dict:
        """Calculate summary statistics from simulation results"""
        stats = {}

        for key, data in results.items():
            # Calculate percentiles for each year
            percentiles = {
                'p10': np.percentile(data, 10, axis=1).tolist(),
                'p25': np.percentile(data, 25, axis=1).tolist(),
                'p50': np.percentile(data, 50, axis=1).tolist(),
                'p75': np.percentile(data, 75, axis=1).tolist(),
                'p90': np.percentile(data, 90, axis=1).tolist(),
                'mean': np.mean(data, axis=1).tolist(),
            }
            stats[key] = percentiles

        return stats


def get_default_us_params() -> CountryParams:
    """
    Default US parameters based on 2024-2025 research

    Sources:
    - Compute: ~3.56M H100-equivalent GPUs in 2025, ~4-5M Nvidia production 2025
    - Capital: $109B private investment 2024
    - Talent: ~63,000 AI researchers
    - Energy: ~183 TWh data center consumption 2024
    """
    return CountryParams(
        # Compute (millions of H100-equivalent GPUs)
        compute_mean=3.5,
        compute_std=0.4,
        compute_growth_rate=0.50,  # 50% annual growth (doubling ~every 1.7 years)
        compute_constraint=0.95,    # Minimal constraints

        # Capital (billions USD)
        capital_mean=109.0,
        capital_std=15.0,
        capital_growth_rate=0.30,  # 30% annual growth
        capital_constraint=0.90,    # Market constraints exist

        # Talent (thousands of researchers)
        talent_mean=63.0,
        talent_std=5.0,
        talent_growth_rate=0.08,   # 8% annual growth (slower than capital/compute)
        talent_constraint=0.85,     # Immigration/education constraints

        # Energy (TWh)
        energy_mean=183.0,
        energy_std=20.0,
        energy_growth_rate=0.15,   # 15% annual growth
        energy_constraint=0.80,     # Grid constraints emerging
    )


def get_default_china_params() -> CountryParams:
    """
    Default China parameters based on 2024-2025 research

    Sources:
    - Compute: ~1.46M H20 (limited), ~200-300K domestic chips
    - Capital: $98B total AI investment (heavy government), $9.3B private
    - Talent: ~52,000 AI researchers
    - Energy: ~104 TWh data center consumption (25% of global)
    """
    return CountryParams(
        # Compute (millions of H100-equivalent GPUs)
        # H20 is ~70% less capable than H100, domestic chips even less
        # 1.46M H20 ≈ 0.44M H100-equivalent, + 0.3M domestic ≈ 0.6M total equiv.
        compute_mean=0.6,
        compute_std=0.15,
        compute_growth_rate=0.35,  # 35% growth but from smaller base
        compute_constraint=0.45,    # Heavy export control constraints

        # Capital (billions USD)
        capital_mean=98.0,
        capital_std=20.0,
        capital_growth_rate=0.25,  # 25% growth
        capital_constraint=0.70,    # Government-directed, less efficient allocation

        # Talent (thousands of researchers)
        talent_mean=52.0,
        talent_std=6.0,
        talent_growth_rate=0.12,   # 12% annual growth (faster than US)
        talent_constraint=0.75,     # Retention issues, quality concerns

        # Energy (TWh)
        energy_mean=104.0,
        energy_std=15.0,
        energy_growth_rate=0.20,   # 20% annual growth
        energy_constraint=0.70,     # Regional energy constraints
    )


if __name__ == "__main__":
    # Test simulation
    sim = AIProgressSimulation(
        get_default_us_params(),
        get_default_china_params(),
        years=10,
        samples=100
    )

    results = sim.run_simulation()
    stats = sim.get_summary_statistics(results)

    print("Simulation complete!")
    print(f"\nFinal year median progress:")
    print(f"US: {stats['us_progress']['p50'][-1]:.2f}")
    print(f"China: {stats['china_progress']['p50'][-1]:.2f}")
