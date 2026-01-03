# Task Management Application - Frontend

A modern React application for managing tasks, built with Vite, TypeScript, TanStack Router, and Tailwind CSS.

## Overview

This frontend application provides a responsive, user-friendly interface for managing tasks with features like filtering, searching, pagination, and multiple view modes (List, Grid, Kanban).

## Tech Stack

- **Framework:** React (v19.2.0)
- **Build Tool:** Vite
- **Language:** TypeScript
- **Routing:** TanStack Router (file-based routing)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI (Radix UI primitives)
- **Form Validation:** Zod with react-hook-form
- **State Management:** Zustand
- **Testing:** Vitest (optional)

## Prerequisites

- Node.js v22.16.0 or above
- npm or yarn package manager

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env` and update with your API URL:
   ```bash
   cp .env.example .env
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## Available Scripts

### Development
```bash
npm run dev          # Start development server
```

### Build
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Testing
```bash
npm test             # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
```

### Linting
```bash
npm run lint         # Run ESLint
```

## Project Structure

```
src/
├── api/              # API client and types
│   └── tasks.ts
├── components/       # React components
│   ├── ui/           # Shadcn UI components
│   ├── CreateTaskForm.tsx
│   ├── UpdateTaskForm.tsx
│   ├── TaskList.tsx
│   ├── TaskDetail.tsx
│   └── ...
├── hooks/            # Custom React hooks
├── lib/              # Utilities and schemas
│   ├── schemas.ts    # Zod validation schemas
│   └── utils.ts
├── routes/           # TanStack Router routes (file-based)
│   ├── index.tsx     # Task list (/)
│   ├── tasks.new.tsx # Create task (/tasks/new)
│   ├── tasks.$id.tsx # Task detail (/tasks/:id)
│   └── tasks.$id.edit.tsx # Edit task (/tasks/:id/edit)
├── store/            # Zustand stores
│   └── taskStore.ts
└── main.tsx          # Application entry point
```

## Features

### Pages

1. **Task List (`/`)** - View all tasks with:
   - Multiple view modes: List, Grid, Kanban
   - Filter by status and priority
   - Search functionality
   - Pagination (in list view)

2. **Create Task (`/tasks/new`)** - Create a new task with:
   - Form validation using Zod
   - All task fields (title, description, status, priority, due date)

3. **Task Detail (`/tasks/:id`)** - View task details with:
   - Full task information
   - Edit and delete actions

4. **Update Task (`/tasks/:id/edit`)** - Edit an existing task with:
   - Pre-filled form
   - Zod validation
   - All task fields

### UI/UX Features

- ✅ Fully responsive (desktop & mobile)
- ✅ User-friendly error messages
- ✅ Loading indicators
- ✅ Success feedback
- ✅ Clean Tailwind-based UI
- ✅ Consistent Shadcn components

## Environment Variables

See `.env.example` for available environment variables.

### Required Variables
- `VITE_API_URL` - Backend API URL (default: `http://localhost:3000`)

## State Management

The application uses Zustand for state management. The `taskStore` manages:
- Tasks list
- Selected task
- Loading and error states
- Filters and pagination
- CRUD operations

## Form Validation

All forms use Zod schemas for validation:
- `createTaskSchema` - For creating tasks
- `updateTaskSchema` - For updating tasks

Forms are implemented with `react-hook-form` and `@hookform/resolvers/zod` for seamless validation.

## License

MIT
