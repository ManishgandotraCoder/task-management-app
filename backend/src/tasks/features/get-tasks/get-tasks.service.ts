import { Injectable } from '@nestjs/common';
import { GetTasksRepository } from './get-tasks.repository';
import { GetTasksDto } from './get-tasks.dto';
import { Task } from '../../shared/entities/task.entity';

@Injectable()
export class GetTasksService {
  constructor(private readonly taskRepository: GetTasksRepository) {}

  async execute(getTasksDto: GetTasksDto): Promise<{
    tasks: Task[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { status, priority, search, page = 1, limit = 10 } = getTasksDto;

    const filters = {
      ...(status && { status }),
      ...(priority && { priority }),
      ...(search && { search }),
    };

    const { tasks, total } = await this.taskRepository.findAll(
      filters,
      page,
      limit,
    );

    return {
      tasks,
      total,
      page,
      limit,
    };
  }
}
