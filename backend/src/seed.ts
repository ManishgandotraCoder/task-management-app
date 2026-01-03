import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import dataSource from '../data-source';
import {
  Task,
  TaskStatus,
  TaskPriority,
} from './tasks/shared/entities/task.entity';

config();

// Parse DATABASE_URL if provided, otherwise use individual env vars
function parseDatabaseConfig() {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    const url = new URL(databaseUrl);
    return {
      host: url.hostname,
      port: parseInt(url.port || '5432', 10),
      username: url.username,
      password: url.password || '',
      database: url.pathname.slice(1),
    };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'ethan',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'task_management',
  };
}

async function ensureDatabaseExists() {
  const dbConfig = parseDatabaseConfig();
  const targetDatabase = dbConfig.database;

  // Create a temporary connection to the default 'postgres' database
  const adminDataSource = new DataSource({
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: 'postgres', // Connect to default database
  });

  try {
    await adminDataSource.initialize();
    console.log('✅ Connected to PostgreSQL server');

    // Check if database exists
    const result: Array<{ '?column?': number }> = await adminDataSource.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [targetDatabase],
    );

    if (result.length === 0) {
      // Database doesn't exist, create it
      console.log(`📦 Creating database "${targetDatabase}"...`);
      await adminDataSource.query(`CREATE DATABASE "${targetDatabase}"`);
      console.log(`✅ Database "${targetDatabase}" created successfully`);
    } else {
      console.log(`✅ Database "${targetDatabase}" already exists`);
    }
  } finally {
    if (adminDataSource.isInitialized) {
      await adminDataSource.destroy();
    }
  }
}

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    const migrations = await dataSource.runMigrations();
    if (migrations.length > 0) {
      console.log(`✅ Successfully ran ${migrations.length} migration(s)`);
      migrations.forEach((migration) => {
        console.log(`   - ${migration.name}`);
      });
    } else {
      console.log('✅ All migrations are already applied');
    }
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    throw error;
  }
}

async function seed() {
  try {
    // Ensure the database exists first
    await ensureDatabaseExists();

    // Initialize the data source connection
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      console.log('✅ Database connection established');
    } else {
      console.log('✅ Using existing database connection');
    }

    // Run migrations to create tables
    await runMigrations();

    // Get the Task repository
    const taskRepository = dataSource.getRepository(Task);

    // Check if tasks already exist
    const existingTasks = await taskRepository.count();
    if (existingTasks > 0) {
      console.log(
        `Database already contains ${existingTasks} tasks. Clearing existing tasks...`,
      );
      await taskRepository.clear();
    }

    // Create sample tasks
    const tasks = [
      {
        title: 'Complete project documentation',
        description:
          'Write comprehensive documentation for the task management application',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      {
        title: 'Review pull requests',
        description: 'Review and provide feedback on open pull requests',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      },
      {
        title: 'Setup CI/CD pipeline',
        description: 'Configure continuous integration and deployment pipeline',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      },
      {
        title: 'Write unit tests',
        description: 'Add unit tests for all service methods',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        title: 'Update dependencies',
        description: 'Update npm packages to latest versions',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        title: 'Design user interface mockups',
        description: 'Create mockups for the frontend application',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      },
      {
        title: 'Fix authentication bug',
        description: 'Resolve issue with user authentication flow',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      },
      {
        title: 'Optimize database queries',
        description: 'Review and optimize slow database queries',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: null,
      },
      {
        title: 'Canceled feature implementation',
        description: 'This task was canceled due to changing requirements',
        status: TaskStatus.CANCELLED,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      },
      {
        title: 'Team meeting notes',
        description: 'Document key decisions from the sprint planning meeting',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      },
      {
        title: 'Implement user authentication',
        description: 'Add login and registration functionality',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create API documentation',
        description: 'Generate Swagger/OpenAPI documentation for all endpoints',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Refactor code structure',
        description: 'Reorganize codebase for better maintainability',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add error handling',
        description:
          'Implement comprehensive error handling across the application',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Setup monitoring and logging',
        description: 'Configure application monitoring and logging services',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Write integration tests',
        description: 'Create end-to-end integration tests',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement search functionality',
        description: 'Add search and filter capabilities to task list',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create user dashboard',
        description: 'Build dashboard with task statistics and overview',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Setup email notifications',
        description: 'Configure email alerts for task updates',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task comments',
        description: 'Add commenting system for tasks',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add file attachments',
        description: 'Enable file uploads for tasks',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: null,
      },
      {
        title: 'Create mobile responsive design',
        description: 'Ensure application works well on mobile devices',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task templates',
        description: 'Create reusable task templates',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add task dependencies',
        description: 'Implement task dependency tracking',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Setup automated backups',
        description: 'Configure automated database backups',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task tags',
        description: 'Add tagging system for better task organization',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create task export feature',
        description: 'Allow users to export tasks to CSV/PDF',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add dark mode support',
        description: 'Implement dark theme for the application',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task reminders',
        description: 'Add reminder notifications for upcoming tasks',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create user profiles',
        description: 'Build user profile pages with settings',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add keyboard shortcuts',
        description: 'Implement keyboard shortcuts for power users',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: null,
      },
      {
        title: 'Implement task archiving',
        description: 'Add ability to archive completed tasks',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create task analytics',
        description: 'Build analytics dashboard for task metrics',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add bulk operations',
        description: 'Enable bulk edit and delete for tasks',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task sharing',
        description: 'Allow users to share tasks with team members',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Setup rate limiting',
        description: 'Configure API rate limiting for security',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add task time tracking',
        description: 'Implement time tracking for tasks',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create task reports',
        description: 'Generate reports for task completion and productivity',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task recurrence',
        description: 'Add support for recurring tasks',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: null,
      },
      {
        title: 'Add task subtasks',
        description: 'Enable creating subtasks within main tasks',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create API client library',
        description: 'Build SDK for API integration',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task sorting',
        description: 'Add multiple sorting options for task lists',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add task favorites',
        description: 'Allow users to mark tasks as favorites',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create task calendar view',
        description: 'Build calendar interface for viewing tasks',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task history',
        description: 'Track and display task change history',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add task watchers',
        description: 'Enable users to watch tasks for updates',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: null,
      },
      {
        title: 'Create task workflows',
        description: 'Implement custom task workflows',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Setup performance monitoring',
        description: 'Configure application performance monitoring',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task cloning',
        description: 'Add ability to duplicate tasks',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add task custom fields',
        description: 'Enable custom fields for tasks',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create task board view',
        description: 'Build Kanban board interface',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task automation',
        description: 'Add automation rules for tasks',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add task estimates',
        description: 'Enable time estimates for tasks',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create task templates library',
        description: 'Build library of common task templates',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task permissions',
        description: 'Add role-based access control for tasks',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add task notifications',
        description: 'Implement in-app notification system',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create task import feature',
        description: 'Allow importing tasks from CSV/JSON',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: null,
      },
      {
        title: 'Implement task search filters',
        description: 'Add advanced filtering options',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add task activity feed',
        description: 'Create activity timeline for tasks',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create task milestones',
        description: 'Implement milestone tracking for projects',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task versioning',
        description: 'Track versions of task changes',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add task quick actions',
        description: 'Implement quick action buttons for common operations',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create task statistics widget',
        description: 'Build widget showing task completion stats',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task batch operations',
        description: 'Enable batch processing of tasks',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add task color coding',
        description: 'Enable color coding for task categories',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create task checklist feature',
        description: 'Add checklist items within tasks',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task linking',
        description: 'Enable linking related tasks together',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add task quick create',
        description: 'Implement fast task creation dialog',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create task export templates',
        description: 'Build customizable export templates',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: null,
      },
      {
        title: 'Implement task sync',
        description: 'Add sync functionality for offline mode',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add task drag and drop',
        description: 'Enable drag and drop for task reordering',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create task preview mode',
        description: 'Add preview pane for task details',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task smart suggestions',
        description: 'Add AI-powered task suggestions',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add task progress tracking',
        description: 'Enable progress percentage for tasks',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create task collaboration features',
        description: 'Add real-time collaboration tools',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task approval workflow',
        description: 'Add approval process for task completion',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add task custom views',
        description: 'Enable users to create custom task views',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create task integration hub',
        description: 'Build integrations with external tools',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task time zones',
        description: 'Add timezone support for due dates',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: null,
      },
      {
        title: 'Add task custom statuses',
        description: 'Enable custom task status creation',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create task audit log',
        description: 'Implement comprehensive audit logging',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task webhooks',
        description: 'Add webhook support for task events',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add task bulk import',
        description: 'Enable importing multiple tasks at once',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create task mobile app',
        description: 'Build native mobile application',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task smart filters',
        description: 'Add intelligent filtering suggestions',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add task custom notifications',
        description: 'Enable customizable notification rules',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create task performance metrics',
        description: 'Build dashboard for performance tracking',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task data validation',
        description: 'Add comprehensive data validation',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add task custom workflows',
        description: 'Enable creating custom task workflows',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create task backup system',
        description: 'Implement automated task backups',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task encryption',
        description: 'Add encryption for sensitive task data',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add task custom fields validation',
        description: 'Implement validation for custom fields',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: null,
      },
      {
        title: 'Create task migration tool',
        description: 'Build tool for migrating tasks between systems',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        due_date: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task caching',
        description: 'Add caching layer for improved performance',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add task real-time updates',
        description: 'Implement real-time task updates via WebSocket',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create task analytics reports',
        description: 'Generate detailed analytics reports',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task conflict resolution',
        description: 'Handle concurrent task modifications',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Add task custom permissions',
        description: 'Enable granular permission settings',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Create task API rate limiting',
        description: 'Implement rate limiting for API endpoints',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        due_date: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implement task data export',
        description: 'Add comprehensive data export functionality',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    ];

    // Insert tasks into the database
    const createdTasks = await taskRepository.save(tasks);
    console.log(
      `✅ Successfully seeded ${createdTasks.length} tasks into the database`,
    );

    // Display summary
    console.log('\n📊 Seeding Summary:');
    console.log(`   - Total tasks: ${createdTasks.length}`);
    console.log(
      `   - PENDING: ${createdTasks.filter((t) => t.status === TaskStatus.PENDING).length}`,
    );
    console.log(
      `   - IN_PROGRESS: ${createdTasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length}`,
    );
    console.log(
      `   - COMPLETED: ${createdTasks.filter((t) => t.status === TaskStatus.COMPLETED).length}`,
    );
    console.log(
      `   - CANCELLED: ${createdTasks.filter((t) => t.status === TaskStatus.CANCELLED).length}`,
    );
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log('\n✨ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error during seeding:', error);
    process.exit(1);
  });
