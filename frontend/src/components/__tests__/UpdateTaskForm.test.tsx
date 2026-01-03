import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { UpdateTaskForm } from '../UpdateTaskForm';
import { useTaskStore } from '@/store/taskStore';
import { TaskStatus, TaskPriority, type Task } from '@/api/tasks';
import type { Mock } from 'vitest';

const mockNavigate = vi.fn();

// Mock the store
vi.mock('@/store/taskStore');
vi.mock('@tanstack/react-router', () => ({
    useParams: () => ({ id: '1' }),
    useNavigate: () => mockNavigate,
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
        <a href={to}>{children}</a>
    ),
}));

const mockUseTaskStore = useTaskStore as unknown as Mock;

describe('UpdateTaskForm', () => {
    const mockUpdateTask = vi.fn();
    const mockFetchTaskById = vi.fn();

    const mockTask: Task = {
        id: '1',
        title: 'Original Task',
        description: 'Original Description',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        due_date: null,
        created_at: new Date(),
        updated_at: new Date(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseTaskStore.mockReturnValue({
            selectedTask: mockTask,
            loading: false,
            error: null,
            fetchTaskById: mockFetchTaskById,
            updateTask: mockUpdateTask,
        });
    });

    it('renders form with pre-filled task data', () => {
        render(<UpdateTaskForm />);

        const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
        expect(titleInput.value).toBe('Original Task');
    });

    it('updates task title', async () => {
        const user = userEvent.setup();
        const updatedTask = { ...mockTask, title: 'Updated Task' };
        mockUpdateTask.mockResolvedValue(updatedTask);

        render(<UpdateTaskForm />);

        const titleInput = screen.getByLabelText(/title/i);
        await user.clear(titleInput);
        await user.type(titleInput, 'Updated Task');

        const submitButton = screen.getByRole('button', { name: /update task/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockUpdateTask).toHaveBeenCalledWith(
                '1',
                expect.objectContaining({
                    title: 'Updated Task',
                })
            );
        });
    });

    it('updates task status', async () => {
        const user = userEvent.setup();
        const updatedTask = { ...mockTask, status: TaskStatus.COMPLETED };
        mockUpdateTask.mockResolvedValue(updatedTask);

        render(<UpdateTaskForm />);

        const completedButton = screen.getByRole('button', { name: /completed/i });
        await user.click(completedButton);

        const submitButton = screen.getByRole('button', { name: /update task/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockUpdateTask).toHaveBeenCalledWith(
                '1',
                expect.objectContaining({
                    status: TaskStatus.COMPLETED,
                })
            );
        });
    });

    it('allows clearing description', async () => {
        const user = userEvent.setup();
        const taskWithDescription = { ...mockTask, description: 'Some description' };
        mockUseTaskStore.mockReturnValue({
            selectedTask: taskWithDescription,
            loading: false,
            error: null,
            fetchTaskById: mockFetchTaskById,
            updateTask: mockUpdateTask,
        });

        render(<UpdateTaskForm />);

        const descriptionInput = screen.getByLabelText(/description/i);
        await user.clear(descriptionInput);

        const submitButton = screen.getByRole('button', { name: /update task/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockUpdateTask).toHaveBeenCalledWith(
                '1',
                expect.objectContaining({
                    description: '',
                })
            );
        });
    });

    it('displays loading state while fetching task', () => {
        mockUseTaskStore.mockReturnValue({
            selectedTask: null,
            loading: true,
            error: null,
            fetchTaskById: mockFetchTaskById,
            updateTask: mockUpdateTask,
        });

        render(<UpdateTaskForm />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('displays error when task fetch fails', () => {
        mockUseTaskStore.mockReturnValue({
            selectedTask: null,
            loading: false,
            error: 'Failed to fetch task',
            fetchTaskById: mockFetchTaskById,
            updateTask: mockUpdateTask,
        });

        render(<UpdateTaskForm />);
        expect(screen.getByText('Failed to fetch task')).toBeInTheDocument();
    });

    it('displays error message from store', () => {
        mockUseTaskStore.mockReturnValue({
            selectedTask: mockTask,
            loading: false,
            error: 'Failed to update task',
            fetchTaskById: mockFetchTaskById,
            updateTask: mockUpdateTask,
        });

        render(<UpdateTaskForm />);
        expect(screen.getByText('Failed to update task')).toBeInTheDocument();
    });

    it('disables form during submission', async () => {
        const user = userEvent.setup();
        let resolvePromise: (value: Task) => void;
        const promise = new Promise<Task>((resolve) => {
            resolvePromise = resolve;
        });

        mockUpdateTask.mockReturnValue(promise);
        mockUseTaskStore.mockReturnValue({
            selectedTask: mockTask,
            loading: false,
            error: null,
            fetchTaskById: mockFetchTaskById,
            updateTask: mockUpdateTask,
        });

        render(<UpdateTaskForm />);

        const submitButton = screen.getByRole('button', { name: /update task/i });
        await user.click(submitButton);

        expect(screen.getByText(/updating/i)).toBeInTheDocument();
        resolvePromise!({ ...mockTask });
    });

    it('fetches task on mount', () => {
        render(<UpdateTaskForm />);
        expect(mockFetchTaskById).toHaveBeenCalledWith('1');
    });

    it('handles task with due date', () => {
        const taskWithDueDate = {
            ...mockTask,
            due_date: new Date('2024-12-31'),
        };

        mockUseTaskStore.mockReturnValue({
            selectedTask: taskWithDueDate,
            loading: false,
            error: null,
            fetchTaskById: mockFetchTaskById,
            updateTask: mockUpdateTask,
        });

        render(<UpdateTaskForm />);

        const dueDateInput = screen.getByLabelText(/due date/i) as HTMLInputElement;
        expect(dueDateInput.value).toBe('2024-12-31');
    });
});

