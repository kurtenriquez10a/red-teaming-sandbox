#!/bin/bash

# TripEase Red Team Testing - Smoke Test Script
echo "🔍 TripEase Red Team Security Testing - Smoke Test"
echo "================================================"

# Set the base URL (will be updated after deployment)
BASE_URL=${1:-"http://localhost:3000"}

echo "Testing against: $BASE_URL"
echo ""

# Test 1: Homepage availability
echo "1️⃣ Testing homepage..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$BASE_URL/"

# Test 2: Submit page
echo "2️⃣ Testing submit page..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$BASE_URL/submit"

# Test 3: API keystroke logging
echo "3️⃣ Testing keystroke API..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$BASE_URL/api/keystroke?field=test&val=sample"

# Test 4: API pixel tracking
echo "4️⃣ Testing pixel API..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$BASE_URL/api/pixel?file=test&token=sample"

# Test 5: Form submission (POST)
echo "5️⃣ Testing form submission..."
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"receiptUrl":"https://drive.google.com/file/d/test123/view"}' \
  -w "Status: %{http_code}\n" \
  "$BASE_URL/api/submit"

echo ""
echo "✅ Smoke test completed!"
echo "📊 Check /tmp/captured.json and /tmp/all_requests.log for captured data"