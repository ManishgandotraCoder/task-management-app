import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import sinon from 'sinon';
import { NotFoundException } from '@nestjs/common';
import { GetTaskByIdService } from '../../../src/tasks/features/get-task-by-id/get-task-by-id.service';
import { GetTaskByIdRepository } from '../../../src/tasks/features/get-task-by-id/get-task-by-id.repository';
import { Task, TaskStatus } from '../../../src/tasks/shared/entities/task.entity';

describe('GetTaskByIdService', () => {
  let service: GetTaskByIdService;
  let taskRepository: GetTaskByIdRepository;
  let findByIdStub: sinon.SinonStub;

  beforeEach(() => {
    taskRepository = {
      findById: sinon.stub(),
    } as unknown as GetTaskByIdRepository;
    findByIdStub = taskRepository.findById as sinon.SinonStub;
    service = new GetTaskByIdService(taskRepository);
  });

  test('should return a task when found', async () => {
    const taskId = 'test-id';
    const expectedTask: Task = {
      id: taskId,
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.PENDING,
      priority: null,
      due_date: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    findByIdStub.resolves(expectedTask);

    const result = await service.execute(taskId);

    assert.strictEqual(result.id, expectedTask.id);
    assert.strictEqual(result.title, expectedTask.title);
    assert.ok(findByIdStub.called);
    assert.strictEqual(findByIdStub.getCall(0).args[0], taskId);
  });

  test('should throw NotFoundException when task is not found', async () => {
    const taskId = 'non-existent-id';

    findByIdStub.resolves(null);

    await assert.rejects(
      async () => await service.execute(taskId),
      (error) => {
        assert(error instanceof NotFoundException);
        assert(error.message.includes(taskId));
        return true;
      },
    );
  });

  test('should handle empty string id', async () => {
    const taskId = '';

    findByIdStub.resolves(null);

    await assert.rejects(
      async () => await service.execute(taskId),
      NotFoundException,
    );
  });
});
