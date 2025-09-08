.PHONY: help setup dev dev-npm prod start build clean test lint format docker-dev docker-prod docker-down

# Default target
.DEFAULT_GOAL := prod

help: ## Show this help message
	@echo "Vintage Market - Development Commands"
	@echo "====================================="
	@echo ""
	@echo "🚀 Quick Start:"
	@echo "  make dev-with-data  - Start dev environment with sample data"
	@echo "  make dev            - Start dev environment (no sample data)"
	@echo "  make prod           - Start production environment"
	@echo ""
	@echo "📊 Database:"
	@echo "  make db-seed        - Add sample data to existing database"
	@echo "  make db-reset       - Reset database and add sample data"
	@echo ""
	@echo "All Commands:"
	@echo "============="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Setup
setup: ## Setup development environment
	@echo "🚀 Setting up Vintage Market..."
	@npm install
	@npm run setup

# Development (npm-based)
dev-npm: ## Start development servers with npm (backend + frontend)
	@echo "🛠️ Starting development environment with npm..."
	@npm run dev

backend: ## Start backend only
	@npm run backend

frontend: ## Start frontend only  
	@npm run frontend

# Production
start: ## Start production servers
	@npm start

build: ## Build for production
	@npm run build

# Database
db-seed: ## Seed database with test data (Docker)
	@echo "🌱 Seeding database with test data..."
	@docker exec -i vintage-market-mysql mysql -u root -proot_password vintagemarket < database/seed_data_clean.sql
	@echo "✅ Database seeded successfully!"

db-reset: ## Reset and reseed database (Docker)
	@echo "🔄 Resetting database..."
	@docker-compose down database
	@docker volume rm mitre-project_mysql_data 2>/dev/null || true
	@docker-compose up -d database
	@echo "⏳ Waiting for database to be healthy..."
	@until [ "$$(docker inspect -f '{{.State.Health.Status}}' vintage-market-mysql)" = "healthy" ]; do \
		sleep 2; \
		echo "  Still waiting for database..."; \
	done
	@echo "✅ Database is ready!"
	@make db-seed

# Maintenance
clean: ## Clean all runtime files (logs, uploads, db)
	@npm run clean

clean-deps: ## Clean dependencies and reinstall
	@rm -rf node_modules backend/node_modules frontend/node_modules
	@npm install

# Code Quality
lint: ## Run linting on all workspaces
	@npm run lint

format: ## Format code in all workspaces
	@npm run format

test: ## Run tests in all workspaces
	@npm test

# Docker
dev: ## Start development environment with Docker (localhost URLs, no Jenkins/Gitea)
	@echo "🛠️ Starting development environment with localhost URLs..."
	@cp .env.dev .env
	@echo "🔄 Starting database..."
	@docker-compose up -d database
	@echo "⏳ Waiting for database to be healthy..."
	@until [ "$$(docker inspect -f '{{.State.Health.Status}}' vintage-market-mysql)" = "healthy" ]; do \
		sleep 2; \
		echo "  Still waiting for database..."; \
	done
	@echo "✅ Database is ready!"
	@echo "🔄 Starting backend..."
	@docker-compose up -d --build backend
	@echo "⏳ Waiting for backend /api/health..."
	@until curl -fsS http://localhost:3001/api/health >/dev/null 2>&1; do \
		sleep 2; \
		echo "  Still waiting for backend..."; \
	done
	@echo "✅ Backend is ready!"
	@echo "🔄 Starting frontend..."
	@docker-compose up -d --build frontend
	@echo "🔄 Starting phpMyAdmin..."
	@docker-compose up -d phpmyadmin
	@echo "🎉 Development environment started successfully!"
	@echo "Frontend: http://localhost:5173"
	@echo "Backend: http://localhost:3001"
	@echo "phpMyAdmin: http://localhost:8081"
	@echo "Note: Jenkins and Gitea are excluded in development mode"
	@echo ""
	@echo "💡 To add sample data, run: make db-seed"

dev-with-data: ## Start development environment with sample data
	@make dev
	@echo "🌱 Adding sample data..."
	@make db-seed

prod: ## Start production environment with Docker (192.168.201.102 URLs, includes Jenkins/Gitea)
	@echo "🚀 Starting production environment with 192.168.201.102 URLs..."
	@cp .env.prod .env
	@echo "🔄 Starting all services including Jenkins and Gitea..."
	@docker-compose --profile production up --build -d
	@echo "✅ Production environment started!"
	@echo "Frontend: http://192.168.201.102:5173"
	@echo "Backend: http://192.168.201.102:3001"
	@echo "phpMyAdmin: http://192.168.201.102:8081"
	@echo "Jenkins: http://192.168.201.102:8080"
	@echo "Gitea: http://192.168.201.102:3002"

docker-dev: ## Start development environment with Docker (legacy, no Jenkins/Gitea)
	@docker-compose up --build

docker-prod: ## Start production environment with Docker (legacy, includes Jenkins/Gitea)
	@docker-compose --profile production -f docker-compose.yml -f docker-compose.prod.yml up --build -d

docker-down: ## Stop Docker containers
	@docker-compose down

docker-clean: ## Stop containers and clean volumes
	@docker-compose down --volumes --remove-orphans

# Utilities
port-check: ## Check if default ports are available
	@npm run port:check

port-clean: ## Clean conflicting port processes
	@npm run port:clean

# Quick commands for different platforms
install: setup ## Alias for setup
run: dev ## Alias for dev
serve: start ## Alias for start