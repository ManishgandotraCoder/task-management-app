import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../shared/entities/task.entity';

@Injectable()
export class UpdateTaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findById(id: string): Promise<Task | null> {
    return this.taskRepository.findOne({ where: { id } });
  }

  async update(id: string, taskData: Partial<Task>): Promise<Task> {
    await this.taskRepository.update(id, taskData);
    const updatedTask = await this.findById(id);
    if (!updatedTask) {
      throw new Error('Task not found after update');
    }
    return updatedTask;
  }
}
