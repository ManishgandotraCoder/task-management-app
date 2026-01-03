import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import sinon from 'sinon';
import { NotFoundException } from '@nestjs/common';
import { RemoveTaskService } from '../../../src/tasks/features/remove-task/remove-task.service';
import { RemoveTaskRepository } from '../../../src/tasks/features/remove-task/remove-task.repository';
import { Task, TaskStatus } from '../../../src/tasks/shared/entities/task.entity';

describe('RemoveTaskService', () => {
  let service: RemoveTaskService;
  let taskRepository: RemoveTaskRepository;
  let findByIdStub: sinon.SinonStub;
  let deleteStub: sinon.SinonStub;

  beforeEach(() => {
    taskRepository = {
      findById: sinon.stub(),
      delete: sinon.stub(),
    } as unknown as RemoveTaskRepository;
    findByIdStub = taskRepository.findById as sinon.SinonStub;
    deleteStub = taskRepository.delete as sinon.SinonStub;
    service = new RemoveTaskService(taskRepository);
  });

  test('should delete a task successfully', async () => {
    const taskId = 'test-id';
    const existingTask: Task = {
      id: taskId,
      title: 'Task to Delete',
      description: null,
      status: TaskStatus.PENDING,
      priority: null,
      due_date: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    findByIdStub.resolves(existingTask);
    deleteStub.resolves(undefined);

    await service.execute(taskId);

    assert.ok(findByIdStub.called);
    assert.ok(deleteStub.called);
    assert.strictEqual(findByIdStub.getCall(0).args[0], taskId);
    assert.strictEqual(deleteStub.getCall(0).args[0], taskId);
  });

  test('should throw NotFoundException when task does not exist', async () => {
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

    assert.ok(findByIdStub.called);
    assert.ok(!deleteStub.called);
  });

  test('should handle empty string id', async () => {
    const taskId = '';

    findByIdStub.resolves(null);

    await assert.rejects(
      async () => await service.execute(taskId),
      NotFoundException,
    );
  });

  test('should not call delete when task is not found', async () => {
    const taskId = 'non-existent-id';

    findByIdStub.resolves(null);

    try {
      await service.execute(taskId);
      assert.fail('Should have thrown NotFoundException');
    } catch (error) {
      assert(error instanceof NotFoundException);
      assert.ok(findByIdStub.called);
      assert.strictEqual(deleteStub.callCount, 0);
    }
  });
});
