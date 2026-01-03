import { Controller, Put, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UpdateTaskService } from './update-task.service';
import { UpdateTaskDto } from './update-task.dto';
import { TaskResponseDto } from './task-response.dto';

@ApiTags('tasks')
@Controller('tasks')
export class UpdateTaskController {
  constructor(private readonly updateTaskService: UpdateTaskService) {}

  @Put(':id')
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 400, description: 'Bad request or invalid UUID format' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.updateTaskService.execute(id, updateTaskDto);
    return TaskResponseDto.fromEntity(task);
  }
}
