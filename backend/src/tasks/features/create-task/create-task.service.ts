import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { CreateTaskRepository } from './create-task.repository';
import { CreateTaskDto } from './create-task.dto';
import { Task, TaskStatus } from '../../shared/entities/task.entity';

@Injectable()
export class CreateTaskService {
  private readonly logger = new Logger(CreateTaskService.name);

  constructor(private readonly taskRepository: CreateTaskRepository) {}

  async execute(createTaskDto: CreateTaskDto): Promise<Task> {
    const taskData: Partial<Task> = {
      title: createTaskDto.title,
      description: createTaskDto.description || null,
      status: createTaskDto.status || TaskStatus.PENDING,
      priority: createTaskDto.priority || null,
      due_date: createTaskDto.due_date
        ? new Date(createTaskDto.due_date)
        : null,
    };

    try {
      return await this.taskRepository.create(taskData);
    } catch (error) {
      this.logger.error('Failed to create task', error);
      throw new BadRequestException('Failed to create task');
    }
  }
}
