# Task Management API - Backend

A NestJS-based REST API for managing tasks, built with TypeScript, PostgreSQL, and TypeORM.

## Overview

This backend follows a **Vertical Slice Architecture** pattern, where each feature is organized as a complete vertical slice containing all layers (controller, service, repository, DTOs) needed for that feature.

## Tech Stack

- **Framework:** NestJS (v11.0.1)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Validation:** class-validator, class-transformer
- **API Documentation:** Swagger/OpenAPI
- **Testing:** Node.js built-in test runner (`node:test`)

## Prerequisites

- Node.js v22.16.0 or above
- PostgreSQL (latest stable version)
- npm or yarn package manager

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env` and update with your database credentials:
   ```bash
   cp .env.example .env
   ```

3. **Run database migrations:**
   ```bash
   npm run migration:run
   ```

4. **Seed the database (optional):**
   ```bash
   npm run seed
   ```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### Production Mode
```bash
npm run build
npm run start:prod
```

## API Documentation

Once the server is running, Swagger documentation is available at:
- **Swagger UI:** `http://localhost:3000/api`

## Database Migrations

### Generate a new migration
```bash
npm run migration:generate -- -n MigrationName
```

### Run migrations
```bash
npm run migration:run
```

### Revert last migration
```bash
npm run migration:revert
```

## Testing

### Run unit tests
```bash
npm run test:unit
```

### Run all tests
```bash
npm test
```

### Run tests with coverage
```bash
npm run test:cov
```

### Run e2e tests
```bash
npm run test:e2e
```

## Project Structure

```
src/
├── config/              # Configuration files
│   └── database.config.ts
├── migrations/          # TypeORM migrations
├── tasks/               # Tasks feature (Vertical Slice)
│   ├── features/        # Feature slices
│   │   ├── create-task/
│   │   ├── get-task-by-id/
│   │   ├── get-tasks/
│   │   ├── remove-task/
│   │   └── update-task/
│   ├── shared/          # Shared entities
│   └── tasks.module.ts
├── app.module.ts        # Root module
└── main.ts              # Application entry point

tests/
└── unit/
    └── services/        # Unit tests for services
```

## Environment Variables

See `.env.example` for all available environment variables.

### Required Variables
- `DATABASE_URL` or individual DB variables (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`)
- `PORT` (optional, defaults to 3000)

### Optional Variables
- `DB_SYNCHRONIZE` (default: false) - Auto-sync database schema (use only in development)
- `DB_LOGGING` (default: false) - Enable SQL query logging

## API Endpoints

### Tasks

- `GET /tasks` - Get all tasks (with filters, search, pagination)
- `GET /tasks/:id` - Get task by ID
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

For detailed API documentation, visit the Swagger UI at `/api` when the server is running.

## License

MIT
