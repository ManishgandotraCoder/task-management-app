import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TaskStatus, TaskPriority, type Task } from '../tasks';

// Use vi.hoisted to create mock instance that can be accessed in both mock factory and tests
const { mockAxiosInstance } = vi.hoisted(() => {
    const mockInstance = {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    };
    return { mockAxiosInstance: mockInstance };
});

// Mock axios module
vi.mock('axios', () => {
    return {
        default: {
            create: vi.fn(() => mockAxiosInstance),
        },
        create: vi.fn(() => mockAxiosInstance),
    };
});

// Import tasksApi after mocking
import { tasksApi } from '../tasks';

describe('tasksApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('getAll', () => {
        it('should fetch all tasks with default params', async () => {
            const mockResponse = {
                data: {
                    tasks: [],
                    total: 0,
                    page: 1,
                    limit: 10,
                },
            };

            mockAxiosInstance.get.mockResolvedValue(mockResponse);

            const result = await tasksApi.getAll();

            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tasks', { params: undefined });
            expect(result).toEqual(mockResponse.data);
        });

        it('should fetch tasks with filters and pagination', async () => {
            const mockTasks: Task[] = [
                {
                    id: '1',
                    title: 'Test Task',
                    description: 'Test Description',
                    status: TaskStatus.PENDING,
                    priority: TaskPriority.HIGH,
                    due_date: new Date(),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ];

            const mockResponse = {
                data: {
                    tasks: mockTasks,
                    total: 1,
                    page: 1,
                    limit: 10,
                },
            };

            const params = {
                status: TaskStatus.PENDING,
                priority: TaskPriority.HIGH,
                search: 'test',
                page: 1,
                limit: 10,
            };

            mockAxiosInstance.get.mockResolvedValue(mockResponse);

            const result = await tasksApi.getAll(params);

            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tasks', { params });
            expect(result.tasks).toHaveLength(1);
            expect(result.tasks[0].id).toBe('1');
        });

        it('should handle API errors', async () => {
            const error = new Error('Network error');
            mockAxiosInstance.get.mockRejectedValue(error);

            await expect(tasksApi.getAll()).rejects.toThrow('Network error');
        });
    });

    describe('getById', () => {
        it('should fetch a task by id', async () => {
            const mockTask: Task = {
                id: '1',
                title: 'Test Task',
                description: 'Test Description',
                status: TaskStatus.PENDING,
                priority: TaskPriority.HIGH,
                due_date: new Date(),
                created_at: new Date(),
                updated_at: new Date(),
            };

            const mockResponse = {
                data: mockTask,
            };

            mockAxiosInstance.get.mockResolvedValue(mockResponse);

            const result = await tasksApi.getById('1');

            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tasks/1');
            expect(result).toEqual(mockTask);
            expect(result.id).toBe('1');
        });

        it('should handle 404 errors', async () => {
            const error = {
                response: {
                    status: 404,
                    data: { message: 'Task not found' },
                },
            };
            mockAxiosInstance.get.mockRejectedValue(error);

            await expect(tasksApi.getById('non-existent')).rejects.toEqual(error);
        });
    });

    describe('create', () => {
        it('should create a task successfully', async () => {
            const createData = {
                title: 'New Task',
                description: 'New Description',
                status: TaskStatus.PENDING,
                priority: TaskPriority.MEDIUM,
            };

            const mockTask: Task = {
                id: '1',
                ...createData,
                description: createData.description || null,
                priority: createData.priority || null,
                due_date: null,
                created_at: new Date(),
                updated_at: new Date(),
            };

            const mockResponse = {
                data: mockTask,
            };

            mockAxiosInstance.post.mockResolvedValue(mockResponse);

            const result = await tasksApi.create(createData);

            expect(mockAxiosInstance.post).toHaveBeenCalledWith('/tasks', createData);
            expect(result).toEqual(mockTask);
            expect(result.title).toBe('New Task');
        });

        it('should create a task with minimal data', async () => {
            const createData = {
                title: 'Minimal Task',
            };

            const mockTask: Task = {
                id: '1',
                title: 'Minimal Task',
                description: null,
                status: TaskStatus.PENDING,
                priority: null,
                due_date: null,
                created_at: new Date(),
                updated_at: new Date(),
            };

            const mockResponse = {
                data: mockTask,
            };

            mockAxiosInstance.post.mockResolvedValue(mockResponse);

            const result = await tasksApi.create(createData);

            expect(mockAxiosInstance.post).toHaveBeenCalledWith('/tasks', createData);
            expect(result.title).toBe('Minimal Task');
        });

        it('should handle validation errors', async () => {
            const createData = {
                title: '',
            };

            const error = {
                response: {
                    status: 400,
                    data: { message: 'Title is required' },
                },
            };

            mockAxiosInstance.post.mockRejectedValue(error);

            await expect(tasksApi.create(createData)).rejects.toEqual(error);
        });
    });

    describe('update', () => {
        it('should update a task successfully', async () => {
            const updateData = {
                title: 'Updated Task',
                status: TaskStatus.IN_PROGRESS,
            };

            const mockTask: Task = {
                id: '1',
                title: 'Updated Task',
                description: null,
                status: TaskStatus.IN_PROGRESS,
                priority: null,
                due_date: null,
                created_at: new Date(),
                updated_at: new Date(),
            };

            const mockResponse = {
                data: mockTask,
            };

            mockAxiosInstance.put.mockResolvedValue(mockResponse);

            const result = await tasksApi.update('1', updateData);

            expect(mockAxiosInstance.put).toHaveBeenCalledWith('/tasks/1', updateData);
            expect(result.title).toBe('Updated Task');
            expect(result.status).toBe(TaskStatus.IN_PROGRESS);
        });

        it('should handle partial updates', async () => {
            const updateData = {
                priority: TaskPriority.HIGH,
            };

            const mockTask: Task = {
                id: '1',
                title: 'Original Title',
                description: null,
                status: TaskStatus.PENDING,
                priority: TaskPriority.HIGH,
                due_date: null,
                created_at: new Date(),
                updated_at: new Date(),
            };

            const mockResponse = {
                data: mockTask,
            };

            mockAxiosInstance.put.mockResolvedValue(mockResponse);

            const result = await tasksApi.update('1', updateData);

            expect(mockAxiosInstance.put).toHaveBeenCalledWith('/tasks/1', updateData);
            expect(result.priority).toBe(TaskPriority.HIGH);
        });

        it('should handle 404 errors for non-existent tasks', async () => {
            const error = {
                response: {
                    status: 404,
                    data: { message: 'Task not found' },
                },
            };

            mockAxiosInstance.put.mockRejectedValue(error);

            await expect(tasksApi.update('non-existent', { title: 'Test' })).rejects.toEqual(error);
        });
    });

    describe('delete', () => {
        it('should delete a task successfully', async () => {
            mockAxiosInstance.delete.mockResolvedValue({ data: {} });

            await tasksApi.delete('1');

            expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/tasks/1');
        });

        it('should handle 404 errors', async () => {
            const error = {
                response: {
                    status: 404,
                    data: { message: 'Task not found' },
                },
            };

            mockAxiosInstance.delete.mockRejectedValue(error);

            await expect(tasksApi.delete('non-existent')).rejects.toEqual(error);
        });
    });
});
