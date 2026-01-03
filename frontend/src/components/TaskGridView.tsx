import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { Task } from '@/api/tasks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTaskStore } from '@/store/taskStore';
import { Loader2 } from 'lucide-react';
import { colorMap_selected } from '@/utils/helper';

interface TaskGridViewProps {
    tasks: Task[];
}

export function TaskGridView({ tasks }: TaskGridViewProps) {
    const navigate = useNavigate();
    const { filters, loadMoreTasks, loading, pagination } = useTaskStore();
    const observerTarget = useRef<HTMLDivElement>(null);
    const isLoadingMore = useRef(false);

    const handleCardClick = (taskId: string) => {
        navigate({ to: '/tasks/$id', params: { id: taskId } });
    };

    const loadMore = useCallback(async () => {
        if (isLoadingMore.current || loading) return;

        const totalPages = Math.ceil(pagination.total / pagination.limit);
        if (pagination.page >= totalPages) return; // No more pages to load

        isLoadingMore.current = true;
        try {
            await loadMoreTasks({ ...filters, limit: 20 });
        } finally {
            isLoadingMore.current = false;
        }
    }, [filters, loadMoreTasks, loading, pagination.page, pagination.limit, pagination.total]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && !isLoadingMore.current) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [loadMore, loading]);

    if (tasks.length === 0 && !loading) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>No tasks found</p>
            </div>
        );
    }

    // Show loading indicator when loading initial data
    if (tasks.length === 0 && loading) {
        return (
            <div className="flex items-center justify-center py-12" role="status" aria-label="Loading tasks">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const totalPages = Math.ceil(pagination.total / pagination.limit);
    const hasMore = pagination.page < totalPages;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tasks.map((task) => (
                    <Card
                        key={task.id}
                        className="cursor-pointer transition-shadow hover:shadow-md"
                        onClick={() => handleCardClick(task.id)}
                    >
                        <CardHeader className="pb-3">
                            <div className="mb-2 flex items-start justify-between gap-2">
                                <CardTitle className="text-base truncate flex-1 min-w-0">{task.title}</CardTitle>
                                {task.priority && (
                                    <Badge className={colorMap_selected[task.priority] + ' flex-shrink-0 text-xs'} >
                                        {task.priority}
                                    </Badge>
                                )}
                            </div>
                            {task.description && (
                                <CardDescription className="text-sm line-clamp-2">{task.description}</CardDescription>
                            )}
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="text-xs">
                                    {task.status.replace('_', ' ')}
                                </Badge>
                            </div>
                            {task.due_date && (
                                <p className="text-xs text-muted-foreground">
                                    Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Loading indicator and infinite scroll trigger */}
            {hasMore && (
                <div ref={observerTarget} className="flex items-center justify-center py-8">
                    {loading && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Loading more tasks...</span>
                        </div>
                    )}
                </div>
            )}

            {!hasMore && tasks.length > 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                    All tasks loaded ({tasks.length} of {pagination.total})
                </div>
            )}
        </div>
    );
}
