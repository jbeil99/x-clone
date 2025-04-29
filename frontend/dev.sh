#!/bin/bash

# 🔁 Check if node_modules exist (basic check if project is ready)
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

echo "🔍 Checking if port 3000 is in use..."

# 🚫 Kill any process using port 3000
fuser -k 3000/tcp > /dev/null 2>&1

echo "✅ Port 3000 is now free."
echo "🚀 Starting Frontend server on http://localhost:3000 ..."
npm run dev
