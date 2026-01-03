# Task Management Application

A full-stack task management application built with NestJS (backend) and React (frontend), demonstrating modern development practices and clean architecture.

## Overview

This application provides a complete solution for managing tasks with features like:
- Create, read, update, and delete tasks
- Filter tasks by status and priority
- Search functionality
- Pagination
- Multiple view modes (List, Grid, Kanban)
- Responsive design

## Tech Stack

### Backend
- **Framework:** NestJS (v11.0.1)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Validation:** class-validator, class-transformer
- **API Documentation:** Swagger/OpenAPI
- **Testing:** Node.js built-in test runner (`node:test`)

### Frontend
- **Framework:** React (v19.2.0)
- **Build Tool:** Vite
- **Language:** TypeScript
- **Routing:** TanStack Router (file-based routing)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Form Validation:** Zod with react-hook-form
- **State Management:** Zustand
- **Testing:** Vitest

## Prerequisites

### Option 1: Local Development
- Node.js v22.16.0 or above
- PostgreSQL (latest stable version)
- npm or yarn package manager
- Git for version control

### Option 2: Docker (Recommended)
- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mumbai
```

## Docker Setup (Recommended)

The easiest way to run the application is using Docker Compose. See [README.Docker.md](./README.Docker.md) for detailed instructions.

**Quick Start with Docker:**
```bash
# Build and start all services
docker-compose up -d --build

# Run database migrations
docker-compose exec backend npm run migration:run

# (Optional) Seed database
docker-compose exec backend npm run seed
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api

For development with hot reload:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

## Local Development Setup

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run migration:run

# (Optional) Seed database
npm run seed

# Start development server
npm run start:dev
```

Backend will run on `http://localhost:3000`
API documentation available at `http://localhost:3000/api`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your API URL (default: http://localhost:3000)

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## Project Structure

```
mumbai/
├── backend/              # NestJS backend application
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── migrations/   # Database migrations
│   │   ├── tasks/       # Tasks feature (Vertical Slice Architecture)
│   │   └── main.ts      # Application entry point
│   ├── tests/           # Unit tests
│   └── README.md        # Backend-specific documentation
│
├── frontend/            # React frontend application
│   ├── src/
│   │   ├── api/         # API client
│   │   ├── components/  # React components
│   │   ├── routes/      # TanStack Router routes
│   │   ├── store/       # Zustand stores
│   │   └── lib/         # Utilities and schemas
│   └── README.md        # Frontend-specific documentation
│
└── README.md            # This file
```

## Architecture

### Backend: Vertical Slice Architecture

The backend follows a **Vertical Slice Architecture** pattern where each feature is organized as a complete vertical slice:

```
tasks/
├── features/
│   ├── create-task/       # Complete slice for creating tasks
│   ├── get-task-by-id/   # Complete slice for getting a task
│   ├── get-tasks/        # Complete slice for listing tasks
│   ├── remove-task/      # Complete slice for deleting tasks
│   └── update-task/      # Complete slice for updating tasks
└── shared/
    └── entities/         # Shared entities
```

Each feature slice contains:
- Controller (handles HTTP requests)
- Service (business logic)
- Repository (data access)
- DTOs (data transfer objects)

## Database Schema

### Tasks Table

| Column      | Type            | Constraints   | Default            |
|-------------|-----------------|---------------|--------------------|
| id          | UUID            | PRIMARY KEY   | Auto-generated     |
| title       | VARCHAR(255)    | NOT NULL      | –                  |
| description | TEXT            | NULL          | –                  |
| status      | ENUM            | NOT NULL      | `'PENDING'`        |
| priority    | ENUM            | NULL          | –                  |
| due_date    | TIMESTAMP       | NULL          | –                  |
| created_at  | TIMESTAMP       | NOT NULL      | Current timestamp  |
| updated_at  | TIMESTAMP       | NOT NULL      | Current timestamp  |

**Status Values:** `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
**Priority Values:** `LOW`, `MEDIUM`, `HIGH`

## API Endpoints

### Tasks

- `GET /tasks` - Get all tasks (supports filters, search, pagination)
- `GET /tasks/:id` - Get task by ID
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

For detailed API documentation, visit the Swagger UI at `http://localhost:3000/api` when the backend is running.

## Testing

### Backend Tests
```bash
cd backend
npm run test:unit    # Run unit tests
npm test             # Run all tests
npm run test:cov     # Run with coverage
```

### Frontend Tests
```bash
cd frontend
npm test             # Run tests
npm run test:ui      # Run tests with UI
```

## Database Migrations

### Run Migrations
```bash
cd backend
npm run migration:run
```

### Generate New Migration
```bash
cd backend
npm run migration:generate -- -n MigrationName
```

### Revert Last Migration
```bash
cd backend
npm run migration:revert
```

## Environment Variables

### Backend (.env)
See `backend/.env.example` for all available variables.

**Required:**
- `DATABASE_URL` or individual DB variables (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`)

**Optional:**
- `PORT` (default: 3000)
- `DB_SYNCHRONIZE` (default: false)
- `DB_LOGGING` (default: false)

### Frontend (.env)
See `frontend/.env.example` for all available variables.

**Required:**
- `VITE_API_URL` (default: http://localhost:3000)

## Development

### Backend Development
```bash
cd backend
npm run start:dev    # Watch mode
npm run start:debug  # Debug mode
```

### Frontend Development
```bash
cd frontend
npm run dev          # Development server with HMR
```

## Production Build

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Key Features Implemented

✅ **Backend:**
- Vertical Slice Architecture
- All CRUD operations
- Input validation (class-validator)
- Swagger/OpenAPI documentation
- Unit tests with `node:test`
- Database migrations

✅ **Frontend:**
- All required pages (List, Create, Detail, Edit)
- Form validation with Zod
- State management with Zustand
- Filtering, search, and pagination
- Multiple view modes (List, Grid, Kanban)
- Responsive design
- Error handling and loading states

## License

MIT

## Support

For issues or questions, please refer to the individual README files in the `backend/` and `frontend/` directories.

