#!/bin/bash

# 🔁 Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
  echo "📦 Activating virtual environment..."
  source venv/bin/activate
fi

echo "🔍 Checking if port 8000 is in use..."

# 🚫 Kill any process using port 8000
fuser -k 8000/tcp > /dev/null 2>&1

echo "✅ Port 8000 is now free."
echo "🚀 Starting Daphne server on http://localhost:8000 ..."

# 🏃‍♂️ Running Daphne with ASGI application
daphne core.asgi:application --port 8000 --bind 0.0.0.0
