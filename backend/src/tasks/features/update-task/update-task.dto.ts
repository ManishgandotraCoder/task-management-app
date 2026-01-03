import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../../shared/entities/task.entity';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'Task title',
    example: 'Updated task title',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'Task description',
    example: 'Updated task description',
  })
  @ValidateIf((o) => o.description !== undefined)
  @IsString()
  @IsOptional()
  description?: string | null;

  @ApiPropertyOptional({
    description: 'Task status',
    enum: TaskStatus,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Task priority',
    enum: TaskPriority,
  })
  @ValidateIf((o) => o.priority !== undefined)
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority | null;

  @ApiPropertyOptional({
    description: 'Task due date',
    example: '2024-12-31T23:59:59Z',
  })
  @ValidateIf((o) => o.due_date !== undefined && o.due_date !== null)
  @IsDateString()
  @IsOptional()
  due_date?: string | null;
}
