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
- **Framework:** NestJS (latest stable version)------------✅
- **Language:** TypeScript------------✅
- **Database:** PostgreSQL------------✅
- **ORM:** TypeORM------------✅
- **Validation:** class-validator, class-transformer------------✅
- **API Documentation:** Swagger / OpenAPI (recommended) ----------✅(Swagger)
- **Testing:** `node:test` (Node.js built-in test runner)------------✅

### Frontend
- **Framework:** React (latest stable version)--------------✅
- **Build Tool:** Vite----------✅
- **Language:** TypeScript----------✅
- **Routing:** TanStack Router (file-based routing)---------✅
- **Styling:** Tailwind CSS----------✅
- **UI Components:** Shadcn UI-----------✅
- **Form Validation:** ZodUI-----------✅
- **State Management:** Zustand----------✅
- **Testing:** Vitest (optional but recommended)-------------✅

### Database
- **Database:** PostgreSQL (latest stable version)------------✅
- **ORM:** TypeORM------------✅
- **Migrations:** TypeORM migrations------------✅

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

### Tasks Table ------------✅

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
- Display tasks list --------- ✅(3 Views List , Grid , Kanban)
- Show title, status, priority, due date--------✅
- Filter by status/priority (recommended)---------✅
- Search & pagination (recommended)------✅
- Links to create, view, edit-------✅

### 2. Create Task (`/tasks/new`)
- Form with Zod validation------------✅
- Shadcn UI components------------✅
- Show validation errors------------✅
- Submit to backend------------✅
- Redirect on success------------✅

### 3. Task Detail (`/tasks/:id`)
- Show full details------------✅
- Edit and delete actions------------✅
- Zustand for shared state (if needed)------------✅

### 4. Update Task (`/tasks/:id/edit`)
- Pre-filled form------------✅
- Zod validation------------✅
- Submit updates to backend------------✅
- Redirect on success------------✅

---

## UI / UX REQUIREMENTS

- Fully responsive (desktop & mobile)------------✅
- User-friendly error messages------------✅
- Loading indicators---------✅
- Success feedback------------✅
- Clean Tailwind-based UI------------✅
- Consistent Shadcn components---------✅

---

## STATE MANAGEMENT

- Use Zustand------------✅
- Store tasks list, selected task-----------✅
- Handle loading & error states-----------✅
- Sync with backend API------------✅

---

## FORM VALIDATION

- Zod for all forms------------✅
- Client + backend validation------------✅
- Clear error messages------------✅

---

# TESTING REQUIREMENTS

## Backend Testing (Required)------------✅

- Unit tests using `node:test`------------✅
- Test all CRUD services------------✅
- Test validation & error cases------------✅
- Mock DB (e.g., Sinon)------------✅

### Test Structure ------------✅

tests/------------✅
├── unit/------------✅
│ └── services/------------✅
│ ├── createTask.service.test.ts------------✅
│ ├── updateTask.service.test.ts------------✅
│ ├── removeTask.service.test.ts------------✅
│ ├── getTaskById.service.test.ts------------✅
│ └── getTasks.service.test.ts------------✅



---

## Frontend Testing (Optional)------------✅

- Vitest component tests------------✅
- Form validation tests------------✅
- User interaction tests------------✅
- Mocked API tests------------✅

---

# DELIVERABLES

## Required

1. **Source Code**------------✅ ( https://github.com/ManishgandotraCoder/task-management-app.git )
   - Backend (NestJS)------------✅
   - Frontend (React)------------✅
   - Database migrations------------✅
   - Git repository------------✅

2. **README.md** ------------✅ Added with all details
   - Project overview
   - Setup & run instructions
   - Migration & test commands
   - API documentation / Swagger
   - Environment variables

3. **Database Migrations** ------------✅ in backend/src/migrations
   - TypeORM migration files
   - Migration instructions

4. **API Documentation** ------------✅ http://localhost:3000/api#/
   - Swagger or detailed README

---

## Optional (Bonus)

- Docker & docker-compose------------✅ 
- `.env.example`------------✅ 
- Postman collection ------------✅ https://universal-equinox-261418.postman.co/workspace/Personal-Workspace~cf1678dc-4f8e-4a1c-8cb7-ffeeaac8bd4e/collection/1529008-310147de-eec9-451b-8cc8-fa3676396d65?action=share&creator=1529008
- Frontend component docs

---

# SUBMISSION INSTRUCTIONS

### Repository Structure

task-management-app/`------------✅ 
├── backend/ or api/
├── frontend/ or web/
├── README.md
└── .gitignore


### Requirements`------------✅ 
- Public repo or shared access
- Clean code & commits
- No hardcoded secrets
- Meaningful commit history

---

## IMPORTANT NOTES

### Do’s`------------✅ 
- Follow vertical slice architecture
- Implement all CRUD features
- Validate frontend & backend
- Write clean TypeScript
- Test before submitting

### Don’ts`------------✅ 
- No `any` in TypeScript
- No hardcoded credentials
- No skipped validation
- No incomplete features
