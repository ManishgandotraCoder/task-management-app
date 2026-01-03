import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    Task,
    TaskStatus,
    TaskPriority,
} from '../../shared/entities/task.entity';

export class TaskResponseDto {
    @ApiProperty({ description: 'Task ID', example: 'uuid' })
    id: string;

    @ApiProperty({
        description: 'Task title',
        example: 'Complete project documentation',
    })
    title: string;

    @ApiPropertyOptional({
        description: 'Task description',
        example: 'Write comprehensive documentation',
    })
    description: string | null;

    @ApiProperty({ description: 'Task status', enum: TaskStatus })
    status: TaskStatus;

    @ApiPropertyOptional({ description: 'Task priority', enum: TaskPriority })
    priority: TaskPriority | null;

    @ApiPropertyOptional({
        description: 'Task due date',
        example: '2024-12-31T23:59:59Z',
    })
    due_date: Date | null;

    @ApiProperty({ description: 'Creation timestamp' })
    created_at: Date;

    @ApiProperty({ description: 'Last update timestamp' })
    updated_at: Date;

    static fromEntity(task: Task): TaskResponseDto {
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            due_date: task.due_date,
            created_at: task.created_at,
            updated_at: task.updated_at,
        };
    }
}
