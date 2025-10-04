#!/bin/bash

# Portfolio Setup Script
echo "🚀 Setting up Saurav Kumar's Portfolio..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Check if .env exists, if not copy from example
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp env.example .env
    echo "⚠️  Please update backend/.env with your database and email credentials"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Check if .env exists, if not copy from example
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp env.example .env
fi

# Go back to root
cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your MySQL database"
echo "2. Update backend/.env with your credentials:"
echo "   - DATABASE_URL"
echo "   - JWT_SECRET"
echo "   - ADMIN_EMAIL and ADMIN_PASSWORD"
echo "   - Email SMTP settings"
echo ""
echo "3. Initialize the database:"
echo "   cd backend"
echo "   npx prisma generate"
echo "   npx prisma db push"
echo "   npm run db:seed"
echo ""
echo "4. Start the development servers:"
echo "   npm run dev"
echo ""
echo "🌐 Access your portfolio:"
echo "   - Portfolio: http://localhost:3000"
echo "   - Admin Panel: http://localhost:3000/admin"
echo "   - API: http://localhost:5000/api"
echo ""
echo "📚 Read the README.md for detailed instructions and deployment guide."
echo ""
echo "Happy coding! 🚀"
