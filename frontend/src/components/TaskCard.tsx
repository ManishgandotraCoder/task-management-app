import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate } from '@tanstack/react-router';
import type { Task } from '@/api/tasks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { colorMap_selected } from '@/utils/helper';

interface TaskCardProps {
    task: Task;
    isDragging?: boolean;
    isLoading?: boolean;
}

export function TaskCard({ task, isDragging = false, isLoading = false }: TaskCardProps) {
    const navigate = useNavigate();
    const dragStartPos = useRef<{ x: number; y: number } | null>(null);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({
        id: task.id,
        data: {
            type: 'task',
            task,
        },
        disabled: isLoading,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isSortableDragging || isDragging ? 0.5 : isLoading ? 0.7 : 1,
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        dragStartPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleClick = (e: React.MouseEvent) => {
        // Only navigate if it wasn't a drag (mouse moved less than 5px)
        if (dragStartPos.current) {
            const deltaX = Math.abs(e.clientX - dragStartPos.current.x);
            const deltaY = Math.abs(e.clientY - dragStartPos.current.y);
            if (deltaX < 5 && deltaY < 5) {
                navigate({ to: '/tasks/$id', params: { id: task.id } });
            }
            dragStartPos.current = null;
        } else {
            navigate({ to: '/tasks/$id', params: { id: task.id } });
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onPointerDown={handlePointerDown}
            onClick={handleClick}
            className="relative"
        >
            <Card
                className={`transition-shadow hover:shadow-md ${isLoading ? 'cursor-wait opacity-70' : 'cursor-grab active:cursor-grabbing'}`}
                {...(isLoading ? {} : { ...attributes, ...listeners })}
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
                    {task.due_date && (
                        <p className="text-xs text-muted-foreground">
                            Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}
                        </p>
                    )}
                </CardContent>
            </Card>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg z-10">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
            )}
        </div>
    );
}

