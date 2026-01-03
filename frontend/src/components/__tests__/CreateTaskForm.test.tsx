import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import CreateTaskForm from '../CreateTaskForm';
import { useTaskStore } from '@/store/taskStore';
import { TaskStatus, TaskPriority, type Task } from '@/api/tasks';
import type { Mock } from 'vitest';

const mockNavigate = vi.fn();

// Mock the store
vi.mock('@/store/taskStore');
vi.mock('@tanstack/react-router', () => ({
    useNavigate: () => mockNavigate,
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
        <a href={to}>{children}</a>
    ),
}));

const mockUseTaskStore = useTaskStore as unknown as Mock;

describe('CreateTaskForm', () => {
    const mockCreateTask = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseTaskStore.mockReturnValue({
            createTask: mockCreateTask,
            loading: false,
            error: null,
        });
    });

    it('renders form fields', () => {
        render(<CreateTaskForm />);

        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Priority')).toBeInTheDocument();
        expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    });

    it('displays validation error for empty title', async () => {
        const user = userEvent.setup();
        render(<CreateTaskForm />);

        const submitButton = screen.getByRole('button', { name: /create task/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/title is required/i)).toBeInTheDocument();
        });
    });

    it('submits form with valid data', async () => {
        const user = userEvent.setup();
        const mockTask = {
            id: '1',
            title: 'Test Task',
            description: 'Test Description',
            status: TaskStatus.PENDING,
            priority: TaskPriority.HIGH,
            due_date: null,
            created_at: new Date(),
            updated_at: new Date(),
        };

        mockCreateTask.mockResolvedValue(mockTask);
        render(<CreateTaskForm />);

        const titleInput = screen.getByLabelText(/title/i);
        const descriptionInput = screen.getByLabelText(/description/i);
        const submitButton = screen.getByRole('button', { name: /create task/i });

        await user.type(titleInput, 'Test Task');
        await user.type(descriptionInput, 'Test Description');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockCreateTask).toHaveBeenCalledWith({
                title: 'Test Task',
                description: 'Test Description',
                status: TaskStatus.PENDING,
                priority: null,
                due_date: undefined,
            });
        });
    });

    it('allows selecting status', async () => {
        const user = userEvent.setup();
        render(<CreateTaskForm />);

        const inProgressButton = screen.getByRole('button', { name: /in progress/i });
        await user.click(inProgressButton);

        const submitButton = screen.getByRole('button', { name: /create task/i });
        await user.type(screen.getByLabelText(/title/i), 'Test Task');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockCreateTask).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: TaskStatus.IN_PROGRESS,
                })
            );
        });
    });

    it('allows selecting priority', async () => {
        const user = userEvent.setup();
        render(<CreateTaskForm />);

        const highPriorityButton = screen.getByRole('button', { name: /^high$/i });
        await user.click(highPriorityButton);

        const submitButton = screen.getByRole('button', { name: /create task/i });
        await user.type(screen.getByLabelText(/title/i), 'Test Task');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockCreateTask).toHaveBeenCalledWith(
                expect.objectContaining({
                    priority: TaskPriority.HIGH,
                })
            );
        });
    });

    it('allows toggling priority off', async () => {
        const user = userEvent.setup();
        render(<CreateTaskForm />);

        const highPriorityButton = screen.getByRole('button', { name: /^high$/i });
        await user.click(highPriorityButton);
        await user.click(highPriorityButton); // Click again to toggle off

        const submitButton = screen.getByRole('button', { name: /create task/i });
        await user.type(screen.getByLabelText(/title/i), 'Test Task');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockCreateTask).toHaveBeenCalledWith(
                expect.objectContaining({
                    priority: null,
                })
            );
        });
    });

    it('displays loading state during submission', async () => {
        const user = userEvent.setup();
        let resolvePromise: (value: Task) => void;
        const promise = new Promise<Task>((resolve) => {
            resolvePromise = resolve;
        });

        mockCreateTask.mockReturnValue(promise);
        mockUseTaskStore.mockReturnValue({
            createTask: mockCreateTask,
            loading: false,
            error: null,
        });

        render(<CreateTaskForm />);

        await user.type(screen.getByLabelText(/title/i), 'Test Task');
        const submitButton = screen.getByRole('button', { name: /create task/i });
        await user.click(submitButton);

        expect(screen.getByText(/creating/i)).toBeInTheDocument();
        resolvePromise!({
            id: '1',
            title: 'Test Task',
            description: null,
            status: TaskStatus.PENDING,
            priority: null,
            due_date: null,
            created_at: new Date(),
            updated_at: new Date(),
        });
    });

    it('displays error message from store', () => {
        mockUseTaskStore.mockReturnValue({
            createTask: mockCreateTask,
            loading: false,
            error: 'Failed to create task',
        });

        render(<CreateTaskForm />);
        expect(screen.getByText('Failed to create task')).toBeInTheDocument();
    });

    it('disables form during loading', () => {
        mockUseTaskStore.mockReturnValue({
            createTask: mockCreateTask,
            loading: true,
            error: null,
        });

        render(<CreateTaskForm />);
        const submitButton = screen.getByRole('button', { name: /creating/i });
        expect(submitButton).toBeDisabled();
    });

    it('shows character count for title', async () => {
        const user = userEvent.setup();
        render(<CreateTaskForm />);

        const titleInput = screen.getByLabelText(/title/i);
        await user.type(titleInput, 'Test');

        expect(screen.getByText(/4 \/ 255/i)).toBeInTheDocument();
    });

    it('allows setting due date using quick date buttons', async () => {
        const user = userEvent.setup();
        render(<CreateTaskForm />);

        const todayButton = screen.getByRole('button', { name: /today/i });
        await user.click(todayButton);

        const dueDateInput = screen.getByLabelText(/due date/i) as HTMLInputElement;
        const today = new Date().toISOString().split('T')[0];

        expect(dueDateInput.value).toBe(today);
    });
});

