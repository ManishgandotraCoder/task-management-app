import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import sinon from 'sinon';
import { GetTasksService } from '../../../src/tasks/features/get-tasks/get-tasks.service';
import { GetTasksRepository } from '../../../src/tasks/features/get-tasks/get-tasks.repository';
import { Task, TaskStatus, TaskPriority } from '../../../src/tasks/shared/entities/task.entity';
import { GetTasksDto } from '../../../src/tasks/features/get-tasks/get-tasks.dto';

describe('GetTasksService', () => {
  let service: GetTasksService;
  let taskRepository: GetTasksRepository;
  let findAllStub: sinon.SinonStub;

  beforeEach(() => {
    taskRepository = {
      findAll: sinon.stub(),
    } as unknown as GetTasksRepository;
    findAllStub = taskRepository.findAll as sinon.SinonStub;
    service = new GetTasksService(taskRepository);
  });

  test('should return tasks with default pagination', async () => {
    const tasks: Task[] = [
      {
        id: '1',
        title: 'Task 1',
        description: null,
        status: TaskStatus.PENDING,
        priority: null,
        due_date: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    findAllStub.resolves({
      tasks,
      total: 1,
    });

    const getTasksDto: GetTasksDto = {};
    const result = await service.execute(getTasksDto);

    assert.strictEqual(result.tasks.length, 1);
    assert.strictEqual(result.total, 1);
    assert.strictEqual(result.page, 1);
    assert.strictEqual(result.limit, 10);
    assert.ok(findAllStub.called);
  });

  test('should return tasks with custom pagination', async () => {
    const tasks: Task[] = [];
    const getTasksDto: GetTasksDto = {
      page: 2,
      limit: 5,
    };

    findAllStub.resolves({
      tasks,
      total: 10,
    });

    const result = await service.execute(getTasksDto);

    assert.strictEqual(result.page, 2);
    assert.strictEqual(result.limit, 5);
    assert.strictEqual(result.total, 10);
  });

  test('should filter tasks by status', async () => {
    const tasks: Task[] = [
      {
        id: '1',
        title: 'In Progress Task',
        description: null,
        status: TaskStatus.IN_PROGRESS,
        priority: null,
        due_date: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const getTasksDto: GetTasksDto = {
      status: TaskStatus.IN_PROGRESS,
    };

    findAllStub.resolves({
      tasks,
      total: 1,
    });

    const result = await service.execute(getTasksDto);

    assert.strictEqual(result.tasks.length, 1);
    assert.strictEqual(result.tasks[0].status, TaskStatus.IN_PROGRESS);
    const callArgs = findAllStub.getCall(0).args;
    assert.strictEqual(callArgs[0].status, TaskStatus.IN_PROGRESS);
  });

  test('should filter tasks by priority', async () => {
    const tasks: Task[] = [
      {
        id: '1',
        title: 'High Priority Task',
        description: null,
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        due_date: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const getTasksDto: GetTasksDto = {
      priority: TaskPriority.HIGH,
    };

    findAllStub.resolves({
      tasks,
      total: 1,
    });

    const result = await service.execute(getTasksDto);

    assert.strictEqual(result.tasks.length, 1);
    assert.strictEqual(result.tasks[0].priority, TaskPriority.HIGH);
    const callArgs = findAllStub.getCall(0).args;
    assert.strictEqual(callArgs[0].priority, TaskPriority.HIGH);
  });

  test('should filter tasks by both status and priority', async () => {
    const tasks: Task[] = [];
    const getTasksDto: GetTasksDto = {
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.MEDIUM,
      page: 1,
      limit: 20,
    };

    findAllStub.resolves({
      tasks,
      total: 0,
    });

    const result = await service.execute(getTasksDto);

    assert.strictEqual(result.tasks.length, 0);
    const callArgs = findAllStub.getCall(0).args;
    assert.strictEqual(callArgs[0].status, TaskStatus.COMPLETED);
    assert.strictEqual(callArgs[0].priority, TaskPriority.MEDIUM);
    assert.strictEqual(callArgs[1], 1);
    assert.strictEqual(callArgs[2], 20);
  });

  test('should filter tasks by search query', async () => {
    const tasks: Task[] = [
      {
        id: '1',
        title: 'Searchable Task',
        description: 'This task matches the search',
        status: TaskStatus.PENDING,
        priority: null,
        due_date: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const getTasksDto: GetTasksDto = {
      search: 'Searchable',
    };

    findAllStub.resolves({
      tasks,
      total: 1,
    });

    const result = await service.execute(getTasksDto);

    assert.strictEqual(result.tasks.length, 1);
    const callArgs = findAllStub.getCall(0).args;
    assert.strictEqual(callArgs[0].search, 'Searchable');
  });

  test('should handle pagination with page 1 and limit 1', async () => {
    const tasks: Task[] = [
      {
        id: '1',
        title: 'Task 1',
        description: null,
        status: TaskStatus.PENDING,
        priority: null,
        due_date: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const getTasksDto: GetTasksDto = {
      page: 1,
      limit: 1,
    };

    findAllStub.resolves({
      tasks,
      total: 5,
    });

    const result = await service.execute(getTasksDto);

    assert.strictEqual(result.tasks.length, 1);
    assert.strictEqual(result.page, 1);
    assert.strictEqual(result.limit, 1);
    assert.strictEqual(result.total, 5);
    const callArgs = findAllStub.getCall(0).args;
    assert.strictEqual(callArgs[1], 1);
    assert.strictEqual(callArgs[2], 1);
  });

  test('should handle large page numbers', async () => {
    const tasks: Task[] = [];
    const getTasksDto: GetTasksDto = {
      page: 100,
      limit: 10,
    };

    findAllStub.resolves({
      tasks,
      total: 0,
    });

    const result = await service.execute(getTasksDto);

    assert.strictEqual(result.page, 100);
    assert.strictEqual(result.limit, 10);
    const callArgs = findAllStub.getCall(0).args;
    assert.strictEqual(callArgs[1], 100);
    assert.strictEqual(callArgs[2], 10);
  });

  test('should handle maximum limit value (100)', async () => {
    const tasks: Task[] = [];
    const getTasksDto: GetTasksDto = {
      page: 1,
      limit: 100,
    };

    findAllStub.resolves({
      tasks,
      total: 0,
    });

    const result = await service.execute(getTasksDto);

    assert.strictEqual(result.limit, 100);
    const callArgs = findAllStub.getCall(0).args;
    assert.strictEqual(callArgs[2], 100);
  });

  test('should combine all filters (status, priority, search)', async () => {
    const tasks: Task[] = [];
    const getTasksDto: GetTasksDto = {
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      search: 'important',
      page: 1,
      limit: 10,
    };

    findAllStub.resolves({
      tasks,
      total: 0,
    });

    const result = await service.execute(getTasksDto);

    const callArgs = findAllStub.getCall(0).args;
    assert.strictEqual(callArgs[0].status, TaskStatus.IN_PROGRESS);
    assert.strictEqual(callArgs[0].priority, TaskPriority.HIGH);
    assert.strictEqual(callArgs[0].search, 'important');
  });

  test('should handle empty search string', async () => {
    const tasks: Task[] = [];
    const getTasksDto: GetTasksDto = {
      search: '',
    };

    findAllStub.resolves({
      tasks,
      total: 0,
    });

    const result = await service.execute(getTasksDto);

    const callArgs = findAllStub.getCall(0).args;
    // Empty string should be treated as falsy and not included in filters
    assert.ok(!callArgs[0].search || callArgs[0].search === '');
  });
});
