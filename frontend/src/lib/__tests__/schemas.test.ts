import { describe, it, expect } from 'vitest';
import { createTaskSchema, updateTaskSchema } from '../schemas';
import { TaskStatus, TaskPriority } from '@/api/tasks';

describe('Task Schemas', () => {
    describe('createTaskSchema', () => {
        it('validates a valid task', () => {
            const validTask = {
                title: 'Test Task',
                description: 'Test Description',
                status: TaskStatus.PENDING,
                priority: TaskPriority.HIGH,
            };

            const result = createTaskSchema.safeParse(validTask);
            expect(result.success).toBe(true);
        });

        it('requires title', () => {
            const invalidTask = {
                description: 'Test Description',
            };

            const result = createTaskSchema.safeParse(invalidTask);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toContain('title');
            }
        });

        it('rejects title longer than 255 characters', () => {
            const invalidTask = {
                title: 'a'.repeat(256),
            };

            const result = createTaskSchema.safeParse(invalidTask);
            expect(result.success).toBe(false);
        });

        it('allows optional fields', () => {
            const minimalTask = {
                title: 'Test Task',
            };

            const result = createTaskSchema.safeParse(minimalTask);
            expect(result.success).toBe(true);
        });
    });

    describe('updateTaskSchema', () => {
        it('allows partial updates', () => {
            const partialUpdate = {
                title: 'Updated Title',
            };

            const result = updateTaskSchema.safeParse(partialUpdate);
            expect(result.success).toBe(true);
        });

        it('allows null values for optional fields', () => {
            const updateWithNulls = {
                description: null,
                priority: null,
                due_date: null,
            };

            const result = updateTaskSchema.safeParse(updateWithNulls);
            expect(result.success).toBe(true);
        });
    });
});

