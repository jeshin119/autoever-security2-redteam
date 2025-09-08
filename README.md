# 🛒 Vintage Market - Security Platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 8+

### One-Command Setup
```bash
git clone <repository>
cd vintage-market
make setup           # Initial setup
make dev-with-data   # Start development with sample data
```

### Alternative Setup Options
```bash
# Development without sample data
make dev

# Production environment (includes Jenkins/Gitea)
make prod
```

Access the application:
- 🌐 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:3001  
- 📊 **Health Check**: http://localhost:3001/api/health
- 🗄️ **phpMyAdmin**: http://localhost:8081

### 🎯 Recommended Workflow
1. **First time setup**: `make dev-with-data` (includes sample data)
2. **Daily development**: `make dev` (fast startup, no sample data)
3. **Add sample data**: `make db-seed` (when needed)
4. **Production testing**: `make prod` (includes Jenkins/Gitea)

## 📋 Available Commands

### 🚀 Quick Start Commands
```bash
make help              # Show all available commands
make dev-with-data     # Start development with sample data (recommended)
make dev               # Start development (no Jenkins/Gitea, no sample data)
make prod              # Start production (includes Jenkins/Gitea)
```

### 📊 Database Commands
```bash
make db-seed           # Add sample data to existing database
make db-reset          # Reset database and add sample data
```

### 🛠️ Development Commands
```bash
make setup             # Initial setup
make build             # Build for production
make clean             # Clean runtime files
make docker-dev        # Development with Docker (legacy)
make docker-prod       # Production with Docker (legacy)
make docker-down       # Stop Docker containers
make docker-clean      # Stop containers and clean volumes
```

### npm Scripts
```bash
npm run dev         # Start both frontend & backend
npm run backend     # Backend only
npm run frontend    # Frontend only
npm run build       # Production build
npm run test        # Run tests
```

### Admin Routes (Lazy-loaded)
- `/admin`                — Admin dashboard
- `/admin/users`          — User Management
- `/admin/products`       — Product Management
- `/admin/transactions`   — Transaction Management
- `/admin/settings`       — System Settings

## 🏗️ Project Structure

```
vintage-market/           # Monorepo root
├── backend/             # Express.js API server
│   ├── src/            # Source code
│   ├── package.json    # Backend dependencies
│   └── Dockerfile      # Backend container
├── frontend/            # React + Vite web app
│   ├── src/            # Source code  
│   ├── package.json    # Frontend dependencies
│   └── Dockerfile      # Frontend container
├── docker/              # Docker configurations
├── docs/                # Documentation
├── scripts/             # Build & utility scripts
├── Makefile            # Cross-platform commands
├── docker-compose.yml  # Container orchestration
└── package.json        # Monorepo configuration
```

## 🛠️ Development

### Environment Setup
The application uses a unified environment configuration:

```env
NODE_ENV=development
BACKEND_PORT=3001  
FRONTEND_PORT=5173
VITE_API_URL=http://localhost:3001
DB_HOST=database
DB_NAME=vintagemarket
DB_USER=vintage_user
DB_PASSWORD=vintage_password
```

### Database
- **Development**: MySQL 8.0 (Docker container)
- **Production**: Configurable (PostgreSQL/MySQL recommended)
- **Database Management**: phpMyAdmin available at http://localhost:8081

#### Database Initialization
The application automatically creates tables using Sequelize ORM when starting. For development with sample data:

```bash
# Option 1: Start with sample data (recommended)
make dev-with-data

# Option 2: Start without data, then add sample data
make dev
make db-seed

# Option 3: Manual database seeding (legacy method)
docker exec -i vintage-market-mysql mysql -u root -proot_password vintagemarket < database/seed_data_clean.sql

# Note: The seed_data_clean.sql file includes UTF-8 character set configuration
# to ensure proper Korean text display
```

#### Sample Data
The `database/seed_data_clean.sql` file contains:
- 5 users (1 admin + 4 regular users)
- 7 products (electronics, furniture, fashion items)
- 7 community posts (restaurant recommendations, tips, etc.)
- 71 community comments
- 3 coupons
- 2 completed transactions

**Note**: The original `db_st.sql` contains both table creation and data insertion. Since Sequelize automatically creates tables, use `seed_data_clean.sql` which contains only INSERT statements to avoid conflicts.

### Hot Reloading
Both frontend and backend support hot reloading in development mode.

## 🔧 CI/CD Environment (Production Only)

### Jenkins & Gitea Setup
The production environment includes Jenkins and Gitea for CI/CD:

- **Jenkins**: http://192.168.201.102:8080
- **Gitea**: http://192.168.201.102:3002

### CI/CD Workflow
1. **Code Push** → Gitea repository
2. **Webhook Trigger** → Jenkins automatically builds
3. **Docker Build** → New images created
4. **Deploy** → Services updated on host

### Jenkins Configuration
Jenkins is configured with:
- Docker CLI for building images
- Git for source code management
- Docker socket access for host deployment
- Pipeline support for automated builds

### Gitea Integration
Gitea provides:
- Git repository hosting
- Webhook integration with Jenkins
- User management and access control
- Issue tracking and pull requests

## 🐳 Docker Deployment

### Development Environment
```bash
# Recommended: Start with sample data
make dev-with-data

# Alternative: Start without sample data
make dev

# Legacy method
make docker-dev
# or
docker-compose up --build
```

### Production Environment
```bash
# Start production with Jenkins/Gitea
make prod

# Legacy method
make docker-prod
# or  
docker-compose --profile production -f docker-compose.yml -f docker-compose.prod.yml up --build
```

### Environment Differences
- **Development (`make dev`)**: 
  - Fast startup (no Jenkins/Gitea)
  - Localhost URLs
  - Hot reloading enabled
  - Volume mounts for live code editing

- **Production (`make prod`)**: 
  - Complete CI/CD environment
  - Jenkins (http://192.168.201.102:8080)
  - Gitea (http://192.168.201.102:3002)
  - Production URLs (192.168.201.102)
  - No volume mounts

#### Compose Files
- `docker-compose.yml`: Base services (backend, frontend, MySQL, phpMyAdmin), ports, volumes, networks
- `docker-compose.override.yml`: Development overrides (dev commands, hot reload, debug ports)
- `docker-compose.prod.yml`: Production overrides (production build targets, resource limits, restart policies)

Usage:
- Dev: `docker-compose up --build` (base + override auto-merged)
- Prod: `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d`

## 📚 Documentation

- **[Development Guide](docs/DEVELOPMENT.md)** - Detailed development setup
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment
- **[API Documentation](docs/API.md)** - REST API reference

## 🔒 Security Notice

This platform contains **intentional security vulnerabilities** including:

- SQL Injection
- Cross-Site Scripting (XSS)  
- Insecure Authentication
- Information Disclosure
- Input Validation Bypasses

**Use only in isolated environments.**

## 🧪 Features

### Backend (Node.js + Express)
- RESTful API with intentional vulnerabilities
- MySQL database with Sequelize ORM
- File upload functionality
- Real-time chat with Socket.IO
- JWT authentication (intentionally weak)
- Sample data seeding with `seed_data_clean.sql`

### Frontend (React + Vite)
- Modern React application
- Responsive design
- Real-time features
- Development debugging tools
- Admin dashboard with role-based access and auto-redirect on login
- Lazy-loaded admin routes with Suspense fallbacks

## 🛠️ Troubleshooting

### Port Conflicts
```bash
make port-check     # Check port availability
make port-clean     # Clean conflicting processes
```

### Database Issues
```bash
# Quick fixes using Makefile commands
make db-seed           # Add sample data to existing database
make db-reset          # Reset database and add sample data

# Manual database operations
docker exec -i vintage-market-mysql mysql -u root -proot_password vintagemarket < database/seed_data_clean.sql
docker exec -it vintage-market-mysql mysql -u root -proot_password vintagemarket
docker exec -it vintage-market-mysql mysql -u root -proot_password vintagemarket -e "SHOW TABLES;"

# Clean and restart database
make docker-clean
make dev-with-data
```

### Character Encoding Issues (Korean Text)
If Korean text appears as garbled characters (ì•ˆë…•í•˜ì„¸ìš"!):

```bash
# Check current character set
docker exec -it vintage-market-mysql mysql -u root -proot_password vintagemarket -e "SHOW VARIABLES LIKE 'character_set%';"

# Fix encoding by restarting with proper UTF-8 settings
make docker-clean
make dev
# Then re-insert data
docker exec -i vintage-market-mysql mysql -u root -proot_password vintagemarket < database/seed_data_clean.sql
```

The MySQL container is configured with UTF-8 character set by default. If issues persist, ensure your terminal supports UTF-8 encoding.

### Docker Issues
```bash
make docker-clean   # Clean containers and volumes
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes  
4. Run tests: `npm test`
5. Submit a pull request

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

**Security Testing** | **OWASP Learning**