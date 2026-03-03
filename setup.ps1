# ILifa Property Group Setup Script (Windows)
# Run this in PowerShell

Write-Host "🚀 ILifa Property Group Setup Script" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green
Write-Host ""

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 20+ first." -ForegroundColor Red
    exit 1
}

# Check Docker
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Docker is not installed. Install Docker for containerized deployment." -ForegroundColor Yellow
}

# Check Docker Compose
try {
    docker compose version | Out-Null
    Write-Host "✅ Docker Compose" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Docker Compose is not installed." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Choose installation method:" -ForegroundColor Cyan
Write-Host "1) Docker (Recommended - Easiest)"
Write-Host "2) Manual (Local development)"
Write-Host ""
$choice = Read-Host "Enter your choice (1 or 2)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "🐳 Setting up with Docker..." -ForegroundColor Cyan
    Write-Host ""
    
    # Setup environment
    if (-not (Test-Path .env)) {
        Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
        Copy-Item .env.example .env
        Write-Host "✅ .env file created" -ForegroundColor Green
        Write-Host "⚠️  Please edit .env file with your configuration" -ForegroundColor Yellow
        Read-Host "Press Enter after editing .env file"
    }
    
    # Build and start
    Write-Host "🏗️  Building and starting containers..." -ForegroundColor Yellow
    docker compose up -d --build
    
    Write-Host ""
    Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Run migrations
    Write-Host "🗃️  Running database migrations..." -ForegroundColor Yellow
    docker compose exec backend npx prisma migrate deploy
    
    Write-Host ""
    Write-Host "✅ Setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Access the application:" -ForegroundColor Cyan
    Write-Host "   Frontend:  http://localhost:3000"
    Write-Host "   Backend:   http://localhost:4000"
    Write-Host "   API Docs:  http://localhost:4000/api/docs"
    Write-Host ""
    Write-Host "📊 Useful commands:" -ForegroundColor Cyan
    Write-Host "   View logs:     docker compose logs -f"
    Write-Host "   Stop:          docker compose down"
    Write-Host "   Restart:       docker compose restart"
    Write-Host ""
    
} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "🔧 Setting up manually..." -ForegroundColor Cyan
    Write-Host ""
    
    # Setup environment
    if (-not (Test-Path .env)) {
        Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
        Copy-Item .env.example .env
        Write-Host "✅ .env file created" -ForegroundColor Green
        Write-Host "⚠️  Please edit .env file with your configuration" -ForegroundColor Yellow
        Read-Host "Press Enter after editing .env file"
    }
    
    # Backend setup
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    
    Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
    npx prisma generate
    
    Write-Host "🗃️  Running database migrations..." -ForegroundColor Yellow
    Write-Host "⚠️  Make sure PostgreSQL is running and DATABASE_URL is configured" -ForegroundColor Yellow
    Read-Host "Press Enter to continue"
    npx prisma migrate dev
    
    Set-Location ..
    
    # Frontend setup
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    
    Set-Location ..
    
    Write-Host ""
    Write-Host "✅ Setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 To start development servers:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Terminal 1 - Backend:"
    Write-Host "   cd backend"
    Write-Host "   npm run start:dev"
    Write-Host ""
    Write-Host "Terminal 2 - Frontend:"
    Write-Host "   cd frontend"
    Write-Host "   npm run dev"
    Write-Host ""
    Write-Host "🌐 Access the application:" -ForegroundColor Cyan
    Write-Host "   Frontend:  http://localhost:3000"
    Write-Host "   Backend:   http://localhost:4000"
    Write-Host "   API Docs:  http://localhost:4000/api/docs"
    Write-Host ""
} else {
    Write-Host "❌ Invalid choice. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host "📚 Need help? Check out:" -ForegroundColor Cyan
Write-Host "   - README.md for overview"
Write-Host "   - SETUP.md for detailed instructions"
Write-Host "   - DEPLOYMENT.md for production deployment"
Write-Host ""
Write-Host "Happy building! 🏗️" -ForegroundColor Green
