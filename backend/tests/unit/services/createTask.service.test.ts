import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import sinon from 'sinon';
import { BadRequestException } from '@nestjs/common';
import { CreateTaskService } from '../../../src/tasks/features/create-task/create-task.service';
import { CreateTaskRepository } from '../../../src/tasks/features/create-task/create-task.repository';
import { Task, TaskStatus, TaskPriority } from '../../../src/tasks/shared/entities/task.entity';
import { CreateTaskDto } from '../../../src/tasks/features/create-task/create-task.dto';

describe('CreateTaskService', () => {
  let service: CreateTaskService;
  let taskRepository: CreateTaskRepository;
  let createStub: sinon.SinonStub;

  beforeEach(() => {
    taskRepository = {
      create: sinon.stub(),
    } as unknown as CreateTaskRepository;
    createStub = taskRepository.create as sinon.SinonStub;
    service = new CreateTaskService(taskRepository);
  });

  test('should create a task successfully with all fields', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      due_date: '2024-12-31T23:59:59Z',
    };

    const expectedTask: Task = {
      id: 'test-id',
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      due_date: new Date('2024-12-31T23:59:59Z'),
      created_at: new Date(),
      updated_at: new Date(),
    };

    createStub.resolves(expectedTask);

    const result = await service.execute(createTaskDto);

    assert.strictEqual(result.id, expectedTask.id);
    assert.strictEqual(result.title, createTaskDto.title);
    assert.strictEqual(result.description, createTaskDto.description);
    assert.strictEqual(result.status, createTaskDto.status);
    assert.strictEqual(result.priority, createTaskDto.priority);
    assert.ok(createStub.called);
  });

  test('should create a task with minimal fields (defaults)', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Minimal Task',
    };

    const expectedTask: Task = {
      id: 'test-id',
      title: 'Minimal Task',
      description: null,
      status: TaskStatus.PENDING,
      priority: null,
      due_date: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    createStub.resolves(expectedTask);

    const result = await service.execute(createTaskDto);

    assert.strictEqual(result.title, createTaskDto.title);
    assert.strictEqual(result.description, null);
    assert.strictEqual(result.status, TaskStatus.PENDING);
    assert.strictEqual(result.priority, null);
    assert.strictEqual(result.due_date, null);
  });

  test('should throw BadRequestException when repository fails', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
    };

    createStub.rejects(new Error('Database error'));

    await assert.rejects(
      async () => await service.execute(createTaskDto),
      (error) => {
        assert(error instanceof BadRequestException);
        assert.strictEqual(error.message, 'Failed to create task');
        return true;
      },
    );
  });

  test('should handle null description correctly', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Task without description',
      description: undefined,
    };

    const expectedTask: Task = {
      id: 'test-id',
      title: 'Task without description',
      description: null,
      status: TaskStatus.PENDING,
      priority: null,
      due_date: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    createStub.resolves(expectedTask);

    const result = await service.execute(createTaskDto);

    assert.strictEqual(result.description, null);
  });

  test('should create a task with maximum title length (255 characters)', async () => {
    const maxTitle = 'a'.repeat(255);
    const createTaskDto: CreateTaskDto = {
      title: maxTitle,
    };

    const expectedTask: Task = {
      id: 'test-id',
      title: maxTitle,
      description: null,
      status: TaskStatus.PENDING,
      priority: null,
      due_date: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    createStub.resolves(expectedTask);

    const result = await service.execute(createTaskDto);

    assert.strictEqual(result.title.length, 255);
    assert.strictEqual(result.title, maxTitle);
    assert.ok(createStub.called);
  });

  test('should handle very long description', async () => {
    const longDescription = 'a'.repeat(10000);
    const createTaskDto: CreateTaskDto = {
      title: 'Task with long description',
      description: longDescription,
    };

    const expectedTask: Task = {
      id: 'test-id',
      title: 'Task with long description',
      description: longDescription,
      status: TaskStatus.PENDING,
      priority: null,
      due_date: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    createStub.resolves(expectedTask);

    const result = await service.execute(createTaskDto);

    assert.strictEqual(result.description, longDescription);
    assert.strictEqual(result.description.length, 10000);
  });

  test('should handle all enum status values', async () => {
    const statuses = [
      TaskStatus.PENDING,
      TaskStatus.IN_PROGRESS,
      TaskStatus.COMPLETED,
      TaskStatus.CANCELLED,
    ];

    for (const status of statuses) {
      const createTaskDto: CreateTaskDto = {
        title: `Task with status ${status}`,
        status,
      };

      const expectedTask: Task = {
        id: 'test-id',
        title: `Task with status ${status}`,
        description: null,
        status,
        priority: null,
        due_date: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      createStub.resolves(expectedTask);

      const result = await service.execute(createTaskDto);

      assert.strictEqual(result.status, status);
    }
  });

  test('should handle all enum priority values', async () => {
    const priorities = [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH];

    for (const priority of priorities) {
      const createTaskDto: CreateTaskDto = {
        title: `Task with priority ${priority}`,
        priority,
      };

      const expectedTask: Task = {
        id: 'test-id',
        title: `Task with priority ${priority}`,
        description: null,
        status: TaskStatus.PENDING,
        priority,
        due_date: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      createStub.resolves(expectedTask);

      const result = await service.execute(createTaskDto);

      assert.strictEqual(result.priority, priority);
    }
  });

  test('should handle invalid date string gracefully', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Task with invalid date',
      due_date: 'invalid-date-string',
    };

    // The service should still attempt to create the date
    // If it fails, it would be caught by the repository layer
    const expectedTask: Task = {
      id: 'test-id',
      title: 'Task with invalid date',
      description: null,
      status: TaskStatus.PENDING,
      priority: null,
      due_date: new Date('invalid-date-string'),
      created_at: new Date(),
      updated_at: new Date(),
    };

    createStub.resolves(expectedTask);

    const result = await service.execute(createTaskDto);

    assert.ok(result.due_date instanceof Date);
  });
});

