import {
  Controller,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RemoveTaskService } from './remove-task.service';

@ApiTags('tasks')
@Controller('tasks')
export class RemoveTaskController {
  constructor(private readonly removeTaskService: RemoveTaskService) { }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID', type: String })
  @ApiResponse({
    status: 204,
    description: 'Task deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.removeTaskService.execute(id);
  }
}
