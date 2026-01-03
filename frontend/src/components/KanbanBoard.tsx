import { useMemo, useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task } from '@/api/tasks';
import { TaskStatus } from '@/api/tasks';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
    tasks: Task[];
    onTaskMove: (taskId: string, newStatus: TaskStatus) => Promise<void>;
}

const STATUS_COLUMNS: { status: TaskStatus; label: string }[] = [
    { status: TaskStatus.PENDING, label: 'Pending' },
    { status: TaskStatus.IN_PROGRESS, label: 'In Progress' },
    { status: TaskStatus.COMPLETED, label: 'Completed' },
    { status: TaskStatus.CANCELLED, label: 'Cancelled' },
];

function DroppableColumn({ 
    status, 
    label, 
    tasks, 
    taskIds, 
    isUpdating,
    movingTaskId
}: { 
    status: TaskStatus; 
    label: string; 
    tasks: Task[]; 
    taskIds: string[]; 
    isUpdating?: boolean;
    movingTaskId?: string | null;
}) {
    const { setNodeRef, isOver } = useDroppable({
        id: status,
        data: {
            type: 'column',
            status,
        },
    });

    return (
        <div className="flex-shrink-0 w-full sm:w-72 md:w-80 relative">
            <div
                ref={setNodeRef}
                className={`bg-muted/50 rounded-lg p-3 sm:p-4 h-full min-h-[400px] sm:min-h-[600px] transition-colors ${isOver ? 'bg-muted/80 ring-2 ring-primary' : ''
                    }`}
                data-status={status}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">{label}</h3>
                    <Badge variant="secondary" className="text-xs">
                        {tasks.length}
                    </Badge>
                </div>
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <TaskCard 
                                key={task.id} 
                                task={task} 
                                isLoading={movingTaskId === task.id}
                            />
                        ))}
                        {tasks.length === 0 && (
                            <div className="text-center text-sm text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                                No tasks
                            </div>
                        )}
                    </div>
                </SortableContext>
            </div>
            {isUpdating && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            )}
        </div>
    );
}

export function KanbanBoard({ tasks, onTaskMove }: KanbanBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [movingTaskId, setMovingTaskId] = useState<string | null>(null);
    const [movingToStatus, setMovingToStatus] = useState<TaskStatus | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const tasksByStatus = useMemo(() => {
        const grouped: Record<TaskStatus, Task[]> = {
            [TaskStatus.PENDING]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.COMPLETED]: [],
            [TaskStatus.CANCELLED]: [],
        };

        tasks.forEach((task) => {
            grouped[task.status].push(task);
        });

        return grouped;
    }, [tasks]);

    const handleDragStart = (event: DragStartEvent) => {
        // Don't allow dragging if a move is in progress
        if (movingTaskId) return;
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const taskId = active.id as string;

        // Check if dropped on a column (status) or another task
        let newStatus: TaskStatus;
        if (over.data.current?.type === 'column') {
            newStatus = over.id as TaskStatus;
        } else if (over.data.current?.type === 'task') {
            // If dropped on another task, get that task's status
            const targetTask = tasks.find((t) => t.id === over.id);
            if (!targetTask) return;
            newStatus = targetTask.status;
        } else {
            // Try to get status from over.id directly
            newStatus = over.id as TaskStatus;
        }

        // Find the task to check current status
        const task = tasks.find((t) => t.id === taskId);
        if (!task || task.status === newStatus) return;

        // Set loading states
        setMovingTaskId(taskId);
        setMovingToStatus(newStatus);

        try {
            // Update task status
            await onTaskMove(taskId, newStatus);
        } finally {
            // Clear loading states
            setMovingTaskId(null);
            setMovingToStatus(null);
        }
    };

    const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

    return (
        <DndContext 
            sensors={movingTaskId ? [] : sensors} 
            onDragStart={handleDragStart} 
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {STATUS_COLUMNS.map(({ status, label }) => {
                    const columnTasks = tasksByStatus[status];
                    const taskIds = columnTasks.map((t) => t.id);
                    const isUpdating = movingToStatus === status;

                    return (
                        <DroppableColumn
                            key={status}
                            status={status}
                            label={label}
                            tasks={columnTasks}
                            taskIds={taskIds}
                            isUpdating={isUpdating}
                            movingTaskId={movingTaskId}
                        />
                    );
                })}
            </div>
            <DragOverlay>
                {activeTask ? (
                    <div className="opacity-90 rotate-2">
                        <TaskCard task={activeTask} isDragging />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

