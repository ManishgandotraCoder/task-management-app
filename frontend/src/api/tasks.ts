import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const TaskStatus = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const TaskPriority = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
} as const;

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];

export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority | null;
    due_date: Date | null;
    created_at: Date;
    updated_at: Date;
}

export interface CreateTaskDto {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    due_date?: string;
}

export interface UpdateTaskDto {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    priority?: TaskPriority | null;
    due_date?: string | null;
}

export interface GetTasksParams {
    status?: TaskStatus;
    priority?: TaskPriority;
    search?: string;
    page?: number;
    limit?: number;
}

export interface GetTasksResponse {
    tasks: Task[];
    total: number;
    page: number;
    limit: number;
}

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const tasksApi = {
    getAll: async (params?: GetTasksParams): Promise<GetTasksResponse> => {
        const response = await api.get<GetTasksResponse>('/tasks', { params });
        return response.data;
    },

    getById: async (id: string): Promise<Task> => {
        const response = await api.get<Task>(`/tasks/${id}`);
        return response.data;
    },

    create: async (data: CreateTaskDto): Promise<Task> => {
        const response = await api.post<Task>('/tasks', data);
        return response.data;
    },

    update: async (id: string, data: UpdateTaskDto): Promise<Task> => {
        const response = await api.put<Task>(`/tasks/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/tasks/${id}`);
    },
};

