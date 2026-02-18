"""
Flask web application for AI Policy Simulation
"""

from flask import Flask, render_template, request, jsonify
import numpy as np
import markdown
import os
import yaml
from ai_policy_simulation import (
    AIProgressSimulation,
    CountryParams,
    get_default_us_params,
    get_default_china_params
)

# Load configuration
def load_config():
    """Load configuration from config.yaml"""
    config_path = os.path.join(os.path.dirname(__file__), 'config.yaml')
    try:
        with open(config_path, 'r') as f:
            return yaml.safe_load(f)
    except FileNotFoundError:
        # Return default config if file not found
        return {
            'app': {'version': '1.0.0'},
            'server': {'port': 5000, 'host': '127.0.0.1', 'debug': True},
            'simulation': {'default_years': 10, 'default_samples': 1000, 'max_samples': 5000}
        }

config = load_config()

app = Flask(__name__)

# Set random seed for reproducibility in development
np.random.seed(42)


@app.route('/')
def index():
    """Render the main simulation interface"""
    return render_template('index.html', version=config['app']['version'])


@app.route('/api/presets')
def get_presets():
    """Get preset configurations from presets folder"""
    presets_dir = os.path.join(os.path.dirname(__file__), 'presets')
    presets = {}

    try:
        # Check if presets directory exists
        if not os.path.exists(presets_dir):
            return jsonify({'error': 'Presets directory not found'}), 404

        # Load all JSON files from presets directory
        for filename in os.listdir(presets_dir):
            if filename.endswith('.json'):
                preset_id = filename[:-5]  # Remove .json extension
                filepath = os.path.join(presets_dir, filename)

                try:
                    with open(filepath, 'r') as f:
                        preset_data = yaml.safe_load(f)
                        presets[preset_id] = preset_data
                except Exception as e:
                    print(f"Error loading preset {filename}: {e}")
                    continue

        if not presets:
            return jsonify({'error': 'No presets found'}), 404

        return jsonify(presets)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/defaults')
def get_defaults():
    """Get default parameter values"""
    us_params = get_default_us_params()
    china_params = get_default_china_params()

    return jsonify({
        'us': {
            'compute_mean': us_params.compute_mean,
            'compute_constraint': us_params.compute_constraint,
            'compute_growth_rate': us_params.compute_growth_rate,
            'capital_mean': us_params.capital_mean,
            'capital_constraint': us_params.capital_constraint,
            'capital_growth_rate': us_params.capital_growth_rate,
            'talent_mean': us_params.talent_mean,
            'talent_constraint': us_params.talent_constraint,
            'talent_growth_rate': us_params.talent_growth_rate,
            'energy_mean': us_params.energy_mean,
            'energy_constraint': us_params.energy_constraint,
            'energy_growth_rate': us_params.energy_growth_rate,
        },
        'china': {
            'compute_mean': china_params.compute_mean,
            'compute_constraint': china_params.compute_constraint,
            'compute_growth_rate': china_params.compute_growth_rate,
            'capital_mean': china_params.capital_mean,
            'capital_constraint': china_params.capital_constraint,
            'capital_growth_rate': china_params.capital_growth_rate,
            'talent_mean': china_params.talent_mean,
            'talent_constraint': china_params.talent_constraint,
            'talent_growth_rate': china_params.talent_growth_rate,
            'energy_mean': china_params.energy_mean,
            'energy_constraint': china_params.energy_constraint,
            'energy_growth_rate': china_params.energy_growth_rate,
        }
    })


@app.route('/api/simulate', methods=['POST'])
def simulate():
    """Run simulation with provided parameters"""
    data = request.json

    # Parse US parameters with new energy model
    us_params = CountryParams(
        compute_mean=float(data['us']['compute_mean']),
        compute_std=float(data['us']['compute_mean']) * 0.12,  # 12% std dev
        compute_growth_rate=float(data['us']['compute_growth_rate']),
        compute_constraint=float(data['us']['compute_constraint']),

        capital_mean=float(data['us']['capital_mean']),
        capital_std=float(data['us']['capital_mean']) * 0.14,  # 14% std dev
        capital_growth_rate=float(data['us']['capital_growth_rate']),
        capital_constraint=float(data['us']['capital_constraint']),

        talent_mean=float(data['us']['talent_mean']),
        talent_std=float(data['us']['talent_mean']) * 0.08,  # 8% std dev
        talent_growth_rate=float(data['us']['talent_growth_rate']),
        talent_constraint=float(data['us']['talent_constraint']),

        energy_mean=float(data['us']['energy_mean']),
        energy_std=float(data['us']['energy_mean']) * 0.11,  # 11% std dev
        energy_constraint=0.80,  # Deprecated parameter, kept for compatibility
        # New energy model parameters
        total_grid_energy=float(data['us']['total_grid_energy']),
        grid_growth_rate=float(data['us']['grid_growth_rate']),
        efficiency_improvement_rate=float(data['us']['efficiency_improvement_rate']),
        grid_saturation_threshold=float(data['us']['grid_saturation_threshold']),
    )

    # Parse China parameters with new energy model
    china_params = CountryParams(
        compute_mean=float(data['china']['compute_mean']),
        compute_std=float(data['china']['compute_mean']) * 0.25,  # Higher uncertainty
        compute_growth_rate=float(data['china']['compute_growth_rate']),
        compute_constraint=float(data['china']['compute_constraint']),

        capital_mean=float(data['china']['capital_mean']),
        capital_std=float(data['china']['capital_mean']) * 0.20,
        capital_growth_rate=float(data['china']['capital_growth_rate']),
        capital_constraint=float(data['china']['capital_constraint']),

        talent_mean=float(data['china']['talent_mean']),
        talent_std=float(data['china']['talent_mean']) * 0.12,
        talent_growth_rate=float(data['china']['talent_growth_rate']),
        talent_constraint=float(data['china']['talent_constraint']),

        energy_mean=float(data['china']['energy_mean']),
        energy_std=float(data['china']['energy_mean']) * 0.14,
        energy_constraint=0.70,  # Deprecated parameter, kept for compatibility
        # New energy model parameters
        total_grid_energy=float(data['china']['total_grid_energy']),
        grid_growth_rate=float(data['china']['grid_growth_rate']),
        efficiency_improvement_rate=float(data['china']['efficiency_improvement_rate']),
        grid_saturation_threshold=float(data['china']['grid_saturation_threshold']),
    )

    # Get simulation parameters
    years = int(data.get('years', 10))
    samples = int(data.get('samples', 200))

    # Use different random seed for each simulation
    np.random.seed()

    # Run simulation
    sim = AIProgressSimulation(us_params, china_params, years=years, samples=samples)
    results = sim.run_simulation()
    stats = sim.get_summary_statistics(results)

    # Calculate additional metrics
    final_year_us = results['us_progress'][-1]
    final_year_china = results['china_progress'][-1]

    # Probability that China catches up (gets within 90% of US progress)
    catchup_probability = np.mean(final_year_china >= 0.9 * final_year_us)

    # Probability that China surpasses US
    surpass_probability = np.mean(final_year_china >= final_year_us)

    return jsonify({
        'stats': stats,
        'years': years,
        'metrics': {
            'catchup_probability': float(catchup_probability),
            'surpass_probability': float(surpass_probability),
            'us_final_median': float(np.median(final_year_us)),
            'china_final_median': float(np.median(final_year_china)),
        }
    })


@app.route('/api/research-report')
def get_research_report():
    """Load and render research report markdown files"""
    reports_dir = os.path.join(os.path.dirname(__file__), 'research_reports')

    print(f"Looking for reports in: {reports_dir}")
    print(f"Reports directory exists: {os.path.exists(reports_dir)}")

    # Load each markdown file
    factors = ['methodology', 'compute', 'capital', 'talent', 'energy', 'synthesis']
    report_html = {}

    for factor in factors:
        file_path = os.path.join(reports_dir, f'{factor}.md')
        print(f"Trying to load: {file_path}")
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                md_content = f.read()
                # Convert markdown to HTML
                html_content = markdown.markdown(md_content, extensions=['extra', 'nl2br'])
                report_html[factor] = html_content
                print(f"Successfully loaded {factor}")
        except FileNotFoundError as e:
            print(f"File not found: {file_path}")
            report_html[factor] = f'<p>Report for {factor} not found at {file_path}.</p>'
        except Exception as e:
            print(f"Error loading {factor}: {e}")
            report_html[factor] = f'<p>Error loading {factor}: {str(e)}</p>'

    return jsonify(report_html)


if __name__ == '__main__':
    app.run(
        host=config['server']['host'],
        port=config['server']['port'],
        debug=config['server']['debug']
    )
