#!/bin/bash

# Test script for verifying JSON parsing fixes locally

echo "🧪 Testing PM-ENG JSON Parsing Fixes"
echo "======================================"
echo ""

# Check if backend is running
echo "📡 Checking if backend is running on port 5001..."
if ! curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
    echo "❌ Backend is not running!"
    echo ""
    echo "Please start the backend first:"
    echo "  cd backend"
    echo "  python app.py"
    echo ""
    exit 1
fi

echo "✅ Backend is running"
echo ""

# Test with the problematic video
echo "🎥 Testing with problematic video: https://youtu.be/Js1gU6L1Zi8"
echo ""

response=$(curl -s -X POST http://localhost:5001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"youtube_url": "https://youtu.be/Js1gU6L1Zi8"}')

# Check if response contains success
if echo "$response" | grep -q '"success": true'; then
    echo "✅ SUCCESS! Video analysis completed without errors"
    echo ""
    
    # Count PM insights
    pm_count=$(echo "$response" | grep -o '"title":' | wc -l)
    echo "📊 PM Insights found: $pm_count"
    
    # Count English expressions
    expr_count=$(echo "$response" | grep -o '"phrase":' | wc -l)
    echo "📝 English Expressions found: $expr_count"
    echo ""
    
    echo "🎉 All tests passed!"
else
    echo "❌ FAILED! Error in response:"
    echo "$response" | python -m json.tool 2>/dev/null || echo "$response"
    exit 1
fi
