#!/usr/bin/env python3
"""Test script to verify the research report API works"""

import sys
import os

# Add the current directory to the path
sys.path.insert(0, os.path.dirname(__file__))

from app import app

print("Testing research report API...\n")

with app.test_client() as client:
    print("Making request to /api/research-report...")
    response = client.get('/api/research-report')

    print(f"Status code: {response.status_code}")

    if response.status_code == 200:
        data = response.get_json()
        print(f"\nSuccess! Got {len(data)} factors:")
        for key in data.keys():
            content_length = len(data[key]) if data[key] else 0
            preview = data[key][:100] if data[key] else "None"
            print(f"  - {key}: {content_length} chars")
            print(f"    Preview: {preview}...")
            print()
    else:
        print(f"\nError: {response.data.decode()}")
