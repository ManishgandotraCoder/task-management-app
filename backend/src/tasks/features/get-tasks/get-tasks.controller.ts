import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetTasksService } from './get-tasks.service';
import { GetTasksDto } from './get-tasks.dto';
import { TaskResponseDto } from './task-response.dto';

@ApiTags('tasks')
@Controller('tasks')
export class GetTasksController {
  constructor(private readonly getTasksService: GetTasksService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all tasks with optional filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Tasks retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        tasks: {
          type: 'array',
          items: { $ref: '#/components/schemas/TaskResponseDto' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async getTasks(@Query() getTasksDto: GetTasksDto): Promise<{
    tasks: TaskResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const result = await this.getTasksService.execute(getTasksDto);
    return {
      tasks: Array.isArray(result.tasks)
        ? result.tasks.map((task) => TaskResponseDto.fromEntity(task))
        : [],
      total: result.total ?? 0,
      page: result.page,
      limit: result.limit,
    };
  }
}
