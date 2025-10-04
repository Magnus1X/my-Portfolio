#!/bin/bash

echo "🚀 Starting Saurav Kumar's Portfolio..."
echo ""

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Check if ports are available
if ! check_port 5000; then
    echo "Backend port 5000 is already in use. Stopping existing process..."
    pkill -f "nodemon"
    sleep 2
fi

if ! check_port 3000; then
    echo "Frontend port 3000 is already in use. Stopping existing process..."
    pkill -f "vite"
    sleep 2
fi

echo "📦 Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!

echo "📦 Starting Frontend Server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servers starting up..."
echo "🌐 Portfolio: http://localhost:3000"
echo "🎛️  Admin Panel: http://localhost:3000/admin"
echo "🔗 API: http://localhost:5000/api"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    pkill -f "nodemon" 2>/dev/null
    pkill -f "vite" 2>/dev/null
    echo "✅ All servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
