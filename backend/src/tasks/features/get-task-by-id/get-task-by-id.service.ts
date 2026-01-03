import { Injectable, NotFoundException } from '@nestjs/common';
import { GetTaskByIdRepository } from './get-task-by-id.repository';
import { Task } from '../../shared/entities/task.entity';

@Injectable()
export class GetTaskByIdService {
  constructor(private readonly taskRepository: GetTaskByIdRepository) {}

  async execute(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }
}
