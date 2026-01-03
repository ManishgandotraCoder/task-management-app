# TASK MANAGEMENT APPLICATION – TECHNICAL ASSESSMENT

## OVERVIEW

This assessment is designed to evaluate your skills in building a full-stack application using modern technologies and best practices. You will be building a **Task Management Application** that demonstrates your proficiency in:

- Backend API development (NestJS)
- Frontend development (React)
- Database design (PostgreSQL with TypeORM)

**Time Limit:** 2 weeks from the date you receive this assessment.

---

## TECHNICAL STACK REQUIREMENTS

### Backend
- **Framework:** NestJS (latest stable version)------------Implemented
- **Language:** TypeScript------------Implemented
- **Database:** PostgreSQL------------Implemented
- **ORM:** TypeORM------------Implemented
- **Validation:** class-validator, class-transformer------------Implemented
- **API Documentation:** Swagger / OpenAPI (recommended) ------ Swagger Implemented
- **Testing:** `node:test` (Node.js built-in test runner)------------Implemented

### Frontend
- **Framework:** React (latest stable version)--------------Implemented
- **Build Tool:** Vite----------------------------Implemented
- **Language:** TypeScript----------------------------Implemented
- **Routing:** TanStack Router (file-based routing)--------Implemented
- **Styling:** Tailwind CSS----------------------------Implemented
- **UI Components:** Shadcn UI-----------------------------Implemented
- **Form Validation:** ZodUI-----------------------------Implemented
- **State Management:** Zustand----------------------------Implemented
- **Testing:** Vitest (optional but recommended)-------------Implemented

### Database
- **Database:** PostgreSQL (latest stable version)------------Implemented
- **ORM:** TypeORM------------Implemented
- **Migrations:** TypeORM migrations------------Implemented

---

## PREREQUISITES

Before starting the assessment, ensure you have the following installed:

- Node.js **v22.16.0 or above**
- PostgreSQL (latest stable version)
- npm or yarn package manager
- Git for version control

---

## ARCHITECTURE REQUIREMENTS

### Backend: Vertical Slice Architecture

The backend **must** follow a **Vertical Slice Architecture** pattern.  
Each feature should be organized as a complete vertical slice containing all layers needed for that feature.

---

### Required Feature Structure

Each feature must follow the structure below:

### Tasks Table ------------Implemented

**Table Name:** `tasks`

| Column Name  | Type            | Constraints   | Default            | Description                                                                 |
|-------------|-----------------|---------------|--------------------|-----------------------------------------------------------------------------|
| id          | UUID            | PRIMARY KEY   | Auto-generated     | Unique identifier for the task                                              |
| title       | VARCHAR(255)    | NOT NULL      | –                  | Task title (maximum 255 characters)                                         |
| description | TEXT            | NULL          | –                  | Task description (optional)                                                 |
| status      | ENUM            | NOT NULL      | `'PENDING'`        | Task status: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`             |
| priority    | ENUM            | NULL          | –                  | Task priority: `LOW`, `MEDIUM`, `HIGH` (optional)                           |
| due_date    | TIMESTAMP       | NULL          | –                  | Task due date (optional)                                                    |
| created_at  | TIMESTAMP       | NOT NULL      | Current timestamp  | Record creation timestamp                                                   |
| updated_at  | TIMESTAMP       | NOT NULL      | Current timestamp  | Record last update timestamp (auto-updated on modification)                 |

---

# FRONTEND REQUIREMENTS

## Required Pages

### 1. Task List (`/` or `/tasks`)
- Display tasks list ------------ Implemented(3 Views List , Grid , Kanban)
- Show title, status, priority, due date------------Implemented
- Filter by status/priority (recommended)------------Implemented
- Search & pagination (recommended)------------Implemented
- Links to create, view, edit------------Implemented

### 2. Create Task (`/tasks/new`)
- Form with Zod validation
- Shadcn UI components
- Show validation errors
- Submit to backend
- Redirect on success

### 3. Task Detail (`/tasks/:id`)
- Show full details
- Edit and delete actions
- Zustand for shared state (if needed)

### 4. Update Task (`/tasks/:id/edit`)
- Pre-filled form
- Zod validation
- Submit updates to backend
- Redirect on success

---

## UI / UX REQUIREMENTS

- Fully responsive (desktop & mobile)
- User-friendly error messages
- Loading indicators
- Success feedback
- Clean Tailwind-based UI
- Consistent Shadcn components

---

## STATE MANAGEMENT

- Use Zustand
- Store tasks list, selected task
- Handle loading & error states
- Sync with backend API

---

## FORM VALIDATION

- Zod for all forms
- Client + backend validation
- Clear error messages

---

# TESTING REQUIREMENTS

## Backend Testing (Required)

- Unit tests using `node:test`
- Test all CRUD services
- Test validation & error cases
- Mock DB (e.g., Sinon)

### Test Structure

tests/
├── unit/
│ └── services/
│ ├── createTask.service.test.ts
│ ├── updateTask.service.test.ts
│ ├── removeTask.service.test.ts
│ ├── getTaskById.service.test.ts
│ └── getTasks.service.test.ts



---

## Frontend Testing (Optional)

- Vitest component tests
- Form validation tests
- User interaction tests
- Mocked API tests

---

# DELIVERABLES

## Required

1. **Source Code**
   - Backend (NestJS)
   - Frontend (React)
   - Database migrations
   - Git repository

2. **README.md**
   - Project overview
   - Setup & run instructions
   - Migration & test commands
   - API documentation / Swagger
   - Environment variables

3. **Database Migrations**
   - TypeORM migration files
   - Migration instructions

4. **API Documentation**
   - Swagger or detailed README

---

## Optional (Bonus)

- Docker & docker-compose
- `.env.example`
- Postman collection
- Frontend component docs

---

# SUBMISSION INSTRUCTIONS

### Repository Structure



task-management-app/
├── backend/ or api/
├── frontend/ or web/
├── README.md
└── .gitignore


### Requirements
- Public repo or shared access
- Clean code & commits
- No hardcoded secrets
- Meaningful commit history

---

## Submission Email

Include:
- GitHub repo URL
- Brief implementation summary
- Key decisions
- Known limitations (if any)

---

## IMPORTANT NOTES

### Do’s
- Follow vertical slice architecture
- Implement all CRUD features
- Validate frontend & backend
- Write clean TypeScript
- Test before submitting

### Don’ts
- No `any` in TypeScript
- No hardcoded credentials
- No skipped validation
- No incomplete features

---

## GOOD LUCK!

Quality over speed.  
We look forward to reviewing a clean, well-structured, and well-tested solution.
