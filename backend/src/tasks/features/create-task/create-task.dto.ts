import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsEnum,
    IsDateString,
    MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../../shared/entities/task.entity';

export class CreateTaskDto {
    @ApiProperty({
        description: 'Task title',
        example: 'Complete project documentation',
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @ApiPropertyOptional({
        description: 'Task description',
        example: 'Write comprehensive documentation for the project',
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        description: 'Task status',
        enum: TaskStatus,
        default: TaskStatus.PENDING,
    })
    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;

    @ApiPropertyOptional({
        description: 'Task priority',
        enum: TaskPriority,
    })
    @IsEnum(TaskPriority)
    @IsOptional()
    priority?: TaskPriority;

    @ApiPropertyOptional({
        description: 'Task due date',
        example: '2024-12-31T23:59:59Z',
    })
    @IsDateString()
    @IsOptional()
    due_date?: string;
}
