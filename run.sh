#!/bin/bash
# Run the AI Policy Simulation

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
VENV_PATH="$SCRIPT_DIR/venv/bin/python"

# Check if local virtual environment exists
if [ ! -f "$VENV_PATH" ]; then
    echo "ERROR: Local virtual environment not found!"
    echo ""
    echo "Please create a virtual environment and install dependencies:"
    echo "  cd $SCRIPT_DIR"
    echo "  python3 -m venv venv"
    echo "  source venv/bin/activate"
    echo "  pip install -r requirements.txt"
    echo ""
    exit 1
fi

echo "Using local virtual environment at $VENV_PATH"
echo "Starting AI Policy Simulation..."
echo "Open your browser to: http://localhost:5000"
echo ""
$VENV_PATH "$SCRIPT_DIR/app.py"
