# 🛒 Vintage Market - Security Platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 8+

### One-Command Setup
```bash
git clone <repository>
cd vintage-market
make setup  # or npm run setup
make dev    # or npm run dev
```

Access the application:
- 🌐 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:3000  
- 📊 **Health Check**: http://localhost:3000/api/health

## 📋 Available Commands

### Make Commands (Recommended)
```bash
make help           # Show all available commands
make setup          # Initial setup
make dev            # Start development servers
make build          # Build for production
make clean          # Clean runtime files
make docker-dev     # Development with Docker
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
BACKEND_PORT=3000  
FRONTEND_PORT=5173
VITE_API_URL=http://localhost:3000
```

### Database
- **Development**: SQLite (automatic)
- **Production**: Configurable (PostgreSQL/MySQL recommended)

### Hot Reloading
Both frontend and backend support hot reloading in development mode.

## 🐳 Docker Deployment

### Development
```bash
make docker-dev
# or
docker-compose up --build
```

### Production  
```bash
make docker-prod
# or  
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

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
- SQLite database with sample data
- File upload functionality
- Real-time chat with Socket.IO
- JWT authentication (intentionally weak)

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
npm run db:reset    # Reset database
npm run clean       # Clean all runtime files
```

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