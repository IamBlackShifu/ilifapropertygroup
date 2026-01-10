#!/bin/bash

# ZimBuildHub Setup Script
# This script helps you set up the project quickly

set -e

echo "🚀 ZimBuildHub Setup Script"
echo "============================"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi
echo "✅ Node.js $(node --version)"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. Install Docker for containerized deployment."
else
    echo "✅ Docker $(docker --version)"
fi

# Check Docker Compose
if ! command -v docker compose &> /dev/null; then
    echo "⚠️  Docker Compose is not installed."
else
    echo "✅ Docker Compose"
fi

echo ""
echo "📦 Choose installation method:"
echo "1) Docker (Recommended - Easiest)"
echo "2) Manual (Local development)"
echo ""
read -p "Enter your choice (1 or 2): " choice

if [ "$choice" == "1" ]; then
    echo ""
    echo "🐳 Setting up with Docker..."
    echo ""
    
    # Setup environment
    if [ ! -f .env ]; then
        echo "📝 Creating .env file..."
        cp .env.example .env
        echo "✅ .env file created"
        echo "⚠️  Please edit .env file with your configuration"
        read -p "Press Enter after editing .env file..."
    fi
    
    # Build and start
    echo "🏗️  Building and starting containers..."
    docker compose up -d --build
    
    echo ""
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    # Run migrations
    echo "🗃️  Running database migrations..."
    docker compose exec backend npx prisma migrate deploy
    
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "🌐 Access the application:"
    echo "   Frontend:  http://localhost:3000"
    echo "   Backend:   http://localhost:4000"
    echo "   API Docs:  http://localhost:4000/api/docs"
    echo ""
    echo "📊 Useful commands:"
    echo "   View logs:     docker compose logs -f"
    echo "   Stop:          docker compose down"
    echo "   Restart:       docker compose restart"
    echo ""
    
elif [ "$choice" == "2" ]; then
    echo ""
    echo "🔧 Setting up manually..."
    echo ""
    
    # Setup environment
    if [ ! -f .env ]; then
        echo "📝 Creating .env file..."
        cp .env.example .env
        echo "✅ .env file created"
        echo "⚠️  Please edit .env file with your configuration"
        read -p "Press Enter after editing .env file..."
    fi
    
    # Backend setup
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    
    echo "🔧 Generating Prisma client..."
    npx prisma generate
    
    echo "🗃️  Running database migrations..."
    echo "⚠️  Make sure PostgreSQL is running and DATABASE_URL is configured"
    read -p "Press Enter to continue..."
    npx prisma migrate dev
    
    cd ..
    
    # Frontend setup
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    
    cd ..
    
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "🚀 To start development servers:"
    echo ""
    echo "Terminal 1 - Backend:"
    echo "   cd backend"
    echo "   npm run start:dev"
    echo ""
    echo "Terminal 2 - Frontend:"
    echo "   cd frontend"
    echo "   npm run dev"
    echo ""
    echo "🌐 Access the application:"
    echo "   Frontend:  http://localhost:3000"
    echo "   Backend:   http://localhost:4000"
    echo "   API Docs:  http://localhost:4000/api/docs"
    echo ""
else
    echo "❌ Invalid choice. Exiting."
    exit 1
fi

echo "📚 Need help? Check out:"
echo "   - README.md for overview"
echo "   - SETUP.md for detailed instructions"
echo "   - DEPLOYMENT.md for production deployment"
echo ""
echo "Happy building! 🏗️"
