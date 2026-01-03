import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTaskService } from './create-task.service';
import { CreateTaskDto } from './create-task.dto';
import { TaskResponseDto } from './task-response.dto';

@ApiTags('tasks')
@Controller('tasks')
export class CreateTaskController {
  constructor(private readonly createTaskService: CreateTaskService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    const task = await this.createTaskService.execute(createTaskDto);
    return TaskResponseDto.fromEntity(task);
  }
}
