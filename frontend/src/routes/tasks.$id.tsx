import { createFileRoute } from '@tanstack/react-router';
import { TaskDetail } from '@/components/TaskDetail';

export const Route = createFileRoute('/tasks/$id')({
    component: TaskDetail,
});

