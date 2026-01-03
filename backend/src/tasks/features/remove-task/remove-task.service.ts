import { Injectable, NotFoundException } from '@nestjs/common';
import { RemoveTaskRepository } from './remove-task.repository';

@Injectable()
export class RemoveTaskService {
  constructor(private readonly taskRepository: RemoveTaskRepository) {}

  async execute(id: string): Promise<void> {
    const existingTask = await this.taskRepository.findById(id);

    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    await this.taskRepository.delete(id);
  }
}
