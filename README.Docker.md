# Docker Setup Guide

This project includes Docker and Docker Compose configuration for easy deployment and development.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

### Production Mode

1. **Create environment file** (optional, defaults are provided):
   ```bash
   cp .env.example .env
   # Edit .env with your configuration if needed
   ```

2. **Build and start all services**:
   ```bash
   docker-compose up -d --build
   ```

3. **Run database migrations**:
   ```bash
   docker-compose exec backend npm run migration:run
   ```

4. **Seed the database** (optional):
   ```bash
   docker-compose exec backend npm run seed
   ```

5. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api
   - Database: localhost:5432

### Development Mode

For development with hot reload:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

This will:
- Enable hot reload for both frontend and backend
- Mount source code as volumes
- Enable development logging

## Services

### PostgreSQL Database
- **Container**: `task-management-db`
- **Port**: 5432 (configurable via `DB_PORT`)
- **Data**: Persisted in `postgres_data` volume
- **Health Check**: Automatically checks database readiness

### Backend API
- **Container**: `task-management-backend`
- **Port**: 3000 (configurable via `BACKEND_PORT`)
- **Health Check**: Available at `/health` endpoint
- **Dependencies**: Waits for PostgreSQL to be healthy before starting

### Frontend
- **Container**: `task-management-frontend`
- **Port**: 5173 (configurable via `FRONTEND_PORT`)
- **Serves**: Built static files via Nginx (production) or Vite dev server (development)

## Environment Variables

Key environment variables (see `.env.example` for full list):

- `DB_USERNAME`: PostgreSQL username (default: `postgres`)
- `DB_PASSWORD`: PostgreSQL password (default: `postgres`)
- `DB_NAME`: Database name (default: `task_management`)
- `DB_PORT`: PostgreSQL port (default: `5432`)
- `BACKEND_PORT`: Backend API port (default: `3000`)
- `FRONTEND_PORT`: Frontend port (default: `5173`)
- `VITE_API_URL`: Backend API URL for frontend (default: `http://localhost:3000`)
- `NODE_ENV`: Environment mode (default: `production`)

## Common Commands

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes (⚠️ deletes database data)
```bash
docker-compose down -v
```

### Rebuild services
```bash
docker-compose build --no-cache
```

### Execute commands in containers
```bash
# Run migrations
docker-compose exec backend npm run migration:run

# Run tests
docker-compose exec backend npm run test:unit

# Access database
docker-compose exec postgres psql -U postgres -d task_management

# Access backend shell
docker-compose exec backend sh

# Access frontend shell
docker-compose exec frontend sh
```

### Restart a specific service
```bash
docker-compose restart backend
```

## Database Migrations

Run migrations after starting the services:

```bash
# Run migrations
docker-compose exec backend npm run migration:run

# Revert last migration
docker-compose exec backend npm run migration:revert

# Generate new migration (requires source code mounted)
docker-compose exec backend npm run migration:generate src/migrations/YourMigrationName
```

## Troubleshooting

### Port already in use
If you get port conflicts, either:
1. Stop the conflicting service
2. Change the port in `.env` file
3. Modify `docker-compose.yml` port mappings

### Database connection issues
- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Check database logs: `docker-compose logs postgres`
- Verify environment variables are set correctly

### Frontend can't connect to backend
- Ensure `VITE_API_URL` in `.env` matches your backend URL
- In Docker, use service name: `http://backend:3000` (for internal communication)
- For browser access, use: `http://localhost:3000`

### Rebuild after dependency changes
```bash
docker-compose build --no-cache backend
docker-compose build --no-cache frontend
docker-compose up -d
```

## Production Considerations

For production deployment:

1. **Use strong passwords**: Update `DB_PASSWORD` and other sensitive values
2. **Remove development volumes**: Don't mount source code in production
3. **Use environment-specific configs**: Create separate `.env.production` file
4. **Enable SSL/TLS**: Configure reverse proxy (nginx/traefik) for HTTPS
5. **Set proper CORS origins**: Update `FRONTEND_URL` to your production domain
6. **Database backups**: Set up regular backups for `postgres_data` volume
7. **Resource limits**: Add resource constraints in `docker-compose.yml`

## Health Checks

All services include health checks:
- **PostgreSQL**: Uses `pg_isready`
- **Backend**: Checks `/health` endpoint
- **Frontend**: Checks nginx availability

View health status:
```bash
docker-compose ps
```

