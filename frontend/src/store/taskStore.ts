import { create } from 'zustand';
import type { Task, GetTasksParams } from '@/api/tasks';
import { TaskStatus, TaskPriority, tasksApi } from '@/api/tasks';

interface TaskStore {
    tasks: Task[];
    selectedTask: Task | null;
    loading: boolean;
    error: string | null;
    filters: {
        status?: TaskStatus;
        priority?: TaskPriority;
        search?: string;
    };
    pagination: {
        page: number;
        limit: number;
        total: number;
    };

    // Actions
    setFilters: (filters: Partial<TaskStore['filters']>) => void;
    setPagination: (pagination: Partial<TaskStore['pagination']>) => void;
    setSelectedTask: (task: Task | null) => void;
    fetchTasks: (params?: GetTasksParams) => Promise<void>;
    loadMoreTasks: (params?: GetTasksParams) => Promise<void>;
    fetchTaskById: (id: string) => Promise<void>;
    createTask: (data: Parameters<typeof tasksApi.create>[0]) => Promise<Task>;
    updateTask: (id: string, data: Parameters<typeof tasksApi.update>[1]) => Promise<Task>;
    deleteTask: (id: string) => Promise<void>;
    reset: () => void;
}

const initialState = {
    tasks: [],
    selectedTask: null,
    loading: false,
    error: null,
    filters: {
        status: undefined,
        priority: undefined,
        search: undefined,
    },
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
    },
};

export const useTaskStore = create<TaskStore>((set, get) => ({
    ...initialState,

    setFilters: (filters) => {
        set((state) => ({
            filters: { ...state.filters, ...filters },
        }));
    },

    setPagination: (pagination) => {
        set((state) => ({
            pagination: { ...state.pagination, ...pagination },
        }));
    },

    setSelectedTask: (task) => {
        set({ selectedTask: task });
    },

    fetchTasks: async (params) => {
        set({ loading: true, error: null });
        try {
            const response = await tasksApi.getAll(params);
            set({
                tasks: response.tasks,
                loading: false,
                pagination: {
                    total: response.total,
                    page: response.page,
                    limit: response.limit,
                }
            });
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to fetch tasks',
            });
        }
    },

    loadMoreTasks: async (params) => {
        const state = get();
        if (state.loading) return; // Prevent concurrent requests

        // Check if there are more pages to load
        const currentPage = state.pagination.page;
        const totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
        if (currentPage >= totalPages) return; // No more pages

        set({ loading: true, error: null });
        try {
            const nextPage = currentPage + 1;
            const response = await tasksApi.getAll({ ...params, page: nextPage, limit: state.pagination.limit });
            set((prevState) => ({
                tasks: [...prevState.tasks, ...response.tasks],
                loading: false,
                pagination: {
                    total: response.total,
                    page: response.page,
                    limit: response.limit,
                }
            }));
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to load more tasks',
            });
        }
    },

    fetchTaskById: async (id) => {
        set({ loading: true, error: null });
        try {
            const task = await tasksApi.getById(id);
            set({ selectedTask: task, loading: false });
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to fetch task',
            });
        }
    },

    createTask: async (data) => {
        set({ loading: true, error: null });
        try {
            const task = await tasksApi.create(data);
            set((state) => ({
                tasks: [task, ...state.tasks],
                loading: false,
            }));
            return task;
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to create task',
            });
            throw error;
        }
    },

    updateTask: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const task = await tasksApi.update(id, data);
            set((state) => ({
                tasks: state.tasks.map((t) => (t.id === id ? task : t)),
                selectedTask: state.selectedTask?.id === id ? task : state.selectedTask,
                loading: false,
            }));
            return task;
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to update task',
            });
            throw error;
        }
    },

    deleteTask: async (id) => {
        set({ loading: true, error: null });
        try {
            await tasksApi.delete(id);
            set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id),
                selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
                loading: false,
            }));
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to delete task',
            });
            throw error;
        }
    },

    reset: () => {
        set(initialState);
    },
}));

