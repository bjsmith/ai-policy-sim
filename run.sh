#!/bin/bash
# Run the AI Policy Simulation

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
VENV_PATH="$SCRIPT_DIR/../venv/bin/python"

# Check if we're using the parent venv or a local one
if [ -f "$VENV_PATH" ]; then
    echo "Using Python environment at $VENV_PATH"
    PYTHON_CMD="$VENV_PATH"
elif [ -f "$SCRIPT_DIR/venv/bin/python" ]; then
    PYTHON_CMD="$SCRIPT_DIR/venv/bin/python"
else
    echo "No virtual environment found. Please install dependencies:"
    echo "  python3 -m venv venv"
    echo "  source venv/bin/activate"
    echo "  pip install -r requirements.txt"
    exit 1
fi

echo "Starting AI Policy Simulation..."
echo "Open your browser to: http://localhost:5000"
echo ""
$PYTHON_CMD "$SCRIPT_DIR/app.py"
