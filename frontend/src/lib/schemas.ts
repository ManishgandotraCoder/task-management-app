import { z } from 'zod';
import { TaskStatus, TaskPriority } from '@/api/tasks';

export const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be at most 255 characters'),
    description: z.string().optional(),
    status: z.enum([TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED, TaskStatus.CANCELLED]).optional(),
    priority: z.enum([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH]).nullable().optional(),
    due_date: z.string().optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be at most 255 characters').optional(),
    description: z.string().nullable().optional(),
    status: z.enum([TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED, TaskStatus.CANCELLED]).optional(),
    priority: z.enum([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH]).nullable().optional(),
    due_date: z.string().nullable().optional(),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;

