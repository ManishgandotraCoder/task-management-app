import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import sinon from 'sinon';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateTaskService } from '../../../src/tasks/features/update-task/update-task.service';
import { UpdateTaskRepository } from '../../../src/tasks/features/update-task/update-task.repository';
import { Task, TaskStatus, TaskPriority } from '../../../src/tasks/shared/entities/task.entity';
import { UpdateTaskDto } from '../../../src/tasks/features/update-task/update-task.dto';

describe('UpdateTaskService', () => {
  let service: UpdateTaskService;
  let taskRepository: UpdateTaskRepository;
  let findByIdStub: sinon.SinonStub;
  let updateStub: sinon.SinonStub;

  beforeEach(() => {
    taskRepository = {
      findById: sinon.stub(),
      update: sinon.stub(),
    } as unknown as UpdateTaskRepository;
    findByIdStub = taskRepository.findById as sinon.SinonStub;
    updateStub = taskRepository.update as sinon.SinonStub;
    service = new UpdateTaskService(taskRepository);
  });

  test('should update a task successfully', async () => {
    const taskId = 'test-id';
    const existingTask: Task = {
      id: taskId,
      title: 'Original Title',
      description: 'Original Description',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
      due_date: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Title',
      status: TaskStatus.IN_PROGRESS,
    };

    const updatedTask: Task = {
      ...existingTask,
      title: 'Updated Title',
      status: TaskStatus.IN_PROGRESS,
    };

    findByIdStub.onFirstCall().resolves(existingTask);
    findByIdStub.onSecondCall().resolves(updatedTask);
    updateStub.resolves(updatedTask);

    const result = await service.execute(taskId, updateTaskDto);

    assert.strictEqual(result.title, 'Updated Title');
    assert.strictEqual(result.status, TaskStatus.IN_PROGRESS);
    assert.ok(findByIdStub.called);
    assert.ok(updateStub.called);
  });

  test('should throw NotFoundException when task does not exist', async () => {
    const taskId = 'non-existent-id';
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Title',
    };

    findByIdStub.resolves(null);

    await assert.rejects(
      async () => await service.execute(taskId, updateTaskDto),
      (error) => {
        assert(error instanceof NotFoundException);
        assert(error.message.includes(taskId));
        return true;
      },
    );
  });

  test('should update only provided fields', async () => {
    const taskId = 'test-id';
    const existingTask: Task = {
      id: taskId,
      title: 'Original Title',
      description: 'Original Description',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
      due_date: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const updateTaskDto: UpdateTaskDto = {
      priority: TaskPriority.HIGH,
    };

    const updatedTask: Task = {
      ...existingTask,
      priority: TaskPriority.HIGH,
    };

    findByIdStub.onFirstCall().resolves(existingTask);
    findByIdStub.onSecondCall().resolves(updatedTask);
    updateStub.resolves(updatedTask);

    const result = await service.execute(taskId, updateTaskDto);

    assert.strictEqual(result.title, existingTask.title);
    assert.strictEqual(result.priority, TaskPriority.HIGH);
  });

  test('should handle null values for optional fields', async () => {
    const taskId = 'test-id';
    const existingTask: Task = {
      id: taskId,
      title: 'Original Title',
      description: 'Original Description',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
      due_date: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const updateTaskDto: UpdateTaskDto = {
      description: null,
      priority: null,
      due_date: null,
    };

    const updatedTask: Task = {
      ...existingTask,
      description: null,
      priority: null,
      due_date: null,
    };

    findByIdStub.onFirstCall().resolves(existingTask);
    findByIdStub.onSecondCall().resolves(updatedTask);
    updateStub.resolves(updatedTask);

    const result = await service.execute(taskId, updateTaskDto);

    assert.strictEqual(result.description, null);
    assert.strictEqual(result.priority, null);
    assert.strictEqual(result.due_date, null);
  });

  test('should throw BadRequestException when update fails', async () => {
    const taskId = 'test-id';
    const existingTask: Task = {
      id: taskId,
      title: 'Original Title',
      description: null,
      status: TaskStatus.PENDING,
      priority: null,
      due_date: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Title',
    };

    findByIdStub.resolves(existingTask);
    updateStub.rejects(new Error('Database error'));

    await assert.rejects(
      async () => await service.execute(taskId, updateTaskDto),
      (error) => {
        assert(error instanceof BadRequestException);
        assert.strictEqual(error.message, 'Failed to update task');
        return true;
      },
    );
  });

  test('should update task with maximum title length (255 characters)', async () => {
    const taskId = 'test-id';
    const maxTitle = 'a'.repeat(255);
    const existingTask: Task = {
      id: taskId,
      title: 'Original Title',
      description: null,
      status: TaskStatus.PENDING,
      priority: null,
      due_date: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const updateTaskDto: UpdateTaskDto = {
      title: maxTitle,
    };

    const updatedTask: Task = {
      ...existingTask,
      title: maxTitle,
    };

    findByIdStub.onFirstCall().resolves(existingTask);
    findByIdStub.onSecondCall().resolves(updatedTask);
    updateStub.resolves(updatedTask);

    const result = await service.execute(taskId, updateTaskDto);

    assert.strictEqual(result.title.length, 255);
    assert.strictEqual(result.title, maxTitle);
  });

  test('should update all status enum values', async () => {
    const taskId = 'test-id';
    const statuses = [
      TaskStatus.PENDING,
      TaskStatus.IN_PROGRESS,
      TaskStatus.COMPLETED,
      TaskStatus.CANCELLED,
    ];

    for (const status of statuses) {
      const existingTask: Task = {
        id: taskId,
        title: 'Original Title',
        description: null,
        status: TaskStatus.PENDING,
        priority: null,
        due_date: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const updateTaskDto: UpdateTaskDto = {
        status,
      };

      const updatedTask: Task = {
        ...existingTask,
        status,
      };

      // Reset stubs for each iteration
      findByIdStub.reset();
      updateStub.reset();
      
      findByIdStub.resolves(existingTask);
      updateStub.resolves(updatedTask);

      const result = await service.execute(taskId, updateTaskDto);

      assert.strictEqual(result.status, status);
    }
  });

  test('should update all priority enum values', async () => {
    const taskId = 'test-id';
    const priorities = [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH];

    for (const priority of priorities) {
      const existingTask: Task = {
        id: taskId,
        title: 'Original Title',
        description: null,
        status: TaskStatus.PENDING,
        priority: null,
        due_date: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const updateTaskDto: UpdateTaskDto = {
        priority,
      };

      const updatedTask: Task = {
        ...existingTask,
        priority,
      };

      // Reset stubs for each iteration
      findByIdStub.reset();
      updateStub.reset();
      
      findByIdStub.resolves(existingTask);
      updateStub.resolves(updatedTask);

      const result = await service.execute(taskId, updateTaskDto);

      assert.strictEqual(result.priority, priority);
    }
  });

  test('should handle updating with empty update DTO', async () => {
    const taskId = 'test-id';
    const existingTask: Task = {
      id: taskId,
      title: 'Original Title',
      description: 'Original Description',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
      due_date: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const updateTaskDto: UpdateTaskDto = {};

    findByIdStub.onFirstCall().resolves(existingTask);
    findByIdStub.onSecondCall().resolves(existingTask);
    updateStub.resolves(existingTask);

    const result = await service.execute(taskId, updateTaskDto);

    assert.strictEqual(result.title, existingTask.title);
    assert.strictEqual(result.description, existingTask.description);
    assert.strictEqual(result.status, existingTask.status);
    assert.strictEqual(result.priority, existingTask.priority);
  });
});
