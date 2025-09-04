.PHONY: help setup dev start build clean test lint format docker-dev docker-prod docker-down

# Default target
help: ## Show this help message
	@echo "Vintage Market - Development Commands"
	@echo "====================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Setup
setup: ## Setup development environment
	@echo "🚀 Setting up Vintage Market..."
	@npm install
	@npm run setup

# Development
dev: ## Start development servers (backend + frontend)
	@echo "🛠️ Starting development environment..."
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
docker-dev: ## Start development environment with Docker
	@docker-compose up --build

docker-prod: ## Start production environment with Docker  
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