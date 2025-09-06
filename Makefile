.PHONY: help setup dev dev-npm prod start build clean test lint format docker-dev docker-prod docker-down

# Default target
.DEFAULT_GOAL := prod

help: ## Show this help message
	@echo "Vintage Market - Development Commands"
	@echo "====================================="
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
db-seed: ## Seed database with test data
	@npm run db:seed

db-reset: ## Reset and reseed database
	@npm run db:reset

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
dev: ## Start development environment with Docker (localhost URLs)
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

prod: ## Start production environment with Docker (192.168.201.102 URLs)
	@echo "🚀 Starting production environment with 192.168.201.102 URLs..."
	@cp .env.prod .env
	@docker-compose up --build -d frontend backend database phpmyadmin
	@echo "✅ Production environment started!"
	@echo "Frontend: http://192.168.201.102:5173"
	@echo "Backend: http://192.168.201.102:3001"
	@echo "phpMyAdmin: http://192.168.201.102:8081"

docker-dev: ## Start development environment with Docker (legacy)
	@docker-compose up --build

docker-prod: ## Start production environment with Docker (legacy)
	@docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

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