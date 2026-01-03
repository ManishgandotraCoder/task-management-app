import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GetTaskByIdService } from './get-task-by-id.service';
import { TaskResponseDto } from './task-response.dto';

@ApiTags('tasks')
@Controller('tasks')
export class GetTaskByIdController {
  constructor(private readonly getTaskByIdService: GetTaskByIdService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Task found',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TaskResponseDto> {
    const task = await this.getTaskByIdService.execute(id);
    return TaskResponseDto.fromEntity(task);
  }
}
