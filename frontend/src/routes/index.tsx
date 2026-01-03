import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { TaskList } from '@/components/TaskList';

export const Route = createFileRoute('/')({
  validateSearch: z.object({
    view: z.enum(['list', 'grid', 'kanban']).optional().catch('kanban'),
  }),
  component: TaskList,
});
