import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { TaskList } from '../TaskList';
import { useTaskStore } from '@/store/taskStore';
import { TaskStatus, TaskPriority } from '@/api/tasks';
import type { Mock } from 'vitest';

// Mock the store
vi.mock('@/store/taskStore');
vi.mock('@tanstack/react-router', () => ({
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
        <a href={to}>{children}</a>
    ),
    useNavigate: () => vi.fn(),
    useSearch: () => ({}),
}));

const mockUseTaskStore = useTaskStore as unknown as Mock;

describe('TaskList', () => {
    const mockFetchTasks = vi.fn();
    const mockSetFilters = vi.fn();
    const mockSetPagination = vi.fn();
    const mockUpdateTask = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseTaskStore.mockReturnValue({
            tasks: [],
            loading: false,
            error: null,
            filters: {},
            fetchTasks: mockFetchTasks,
            setFilters: mockSetFilters,
            setPagination: mockSetPagination,
            updateTask: mockUpdateTask,
        });
    });

    it('renders task list title', () => {
        render(<TaskList />);
        expect(screen.getByText('Tasks')).toBeInTheDocument();
    });

    it('renders new task button', () => {
        render(<TaskList />);
        expect(screen.getByText('New Task')).toBeInTheDocument();
    });

    it('displays loading state', () => {
        mockUseTaskStore.mockReturnValue({
            tasks: [],
            loading: true,
            error: null,
            filters: {},
            fetchTasks: mockFetchTasks,
            setFilters: mockSetFilters,
            setPagination: mockSetPagination,
            updateTask: mockUpdateTask,
        });

        render(<TaskList />);
        // Check for loading indicator (Loader2 component with role="status")
        expect(screen.getByRole('status', { name: /loading tasks/i })).toBeInTheDocument();
    });

    it('displays empty state when no tasks', () => {
        render(<TaskList />);
        expect(screen.getByText(/No tasks found/i)).toBeInTheDocument();
    });

    it('displays tasks when available', () => {
        const mockTasks = [
            {
                id: '1',
                title: 'Test Task',
                description: 'Test Description',
                status: TaskStatus.PENDING,
                priority: TaskPriority.HIGH,
                due_date: null,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        mockUseTaskStore.mockReturnValue({
            tasks: mockTasks,
            loading: false,
            error: null,
            filters: {},
            fetchTasks: mockFetchTasks,
            setFilters: mockSetFilters,
            setPagination: mockSetPagination,
            updateTask: mockUpdateTask,
        });

        render(<TaskList />);
        expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
});

