import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { UpdateTaskRepository } from './update-task.repository';
import { UpdateTaskDto } from './update-task.dto';
import { Task } from '../../shared/entities/task.entity';

@Injectable()
export class UpdateTaskService {
  private readonly logger = new Logger(UpdateTaskService.name);

  constructor(private readonly taskRepository: UpdateTaskRepository) {}

  async execute(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const existingTask = await this.taskRepository.findById(id);

    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const updateData: Partial<Task> = {};

    if (updateTaskDto.title !== undefined) {
      updateData.title = updateTaskDto.title;
    }

    if (updateTaskDto.description !== undefined) {
      updateData.description = updateTaskDto.description ?? null;
    }

    if (updateTaskDto.status !== undefined) {
      updateData.status = updateTaskDto.status;
    }

    if (updateTaskDto.priority !== undefined) {
      updateData.priority = updateTaskDto.priority ?? null;
    }

    if (updateTaskDto.due_date !== undefined) {
      updateData.due_date = updateTaskDto.due_date
        ? new Date(updateTaskDto.due_date)
        : null;
    }

    try {
      return await this.taskRepository.update(id, updateData);
    } catch (error) {
      this.logger.error(`Failed to update task ${id}`, error);
      throw new BadRequestException('Failed to update task');
    }
  }
}
