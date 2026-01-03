import { createFileRoute } from '@tanstack/react-router';
import { UpdateTaskForm } from '@/components/UpdateTaskForm';

export const Route = createFileRoute('/tasks/$id/edit')({
    component: UpdateTaskForm,
});

