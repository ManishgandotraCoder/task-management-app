import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { Task } from '@/api/tasks';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Loader2, Eye, Edit, Trash2 } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { colorMap_selected } from '@/utils/helper';

interface TaskListViewProps {
    tasks: Task[];
}

export function TaskListView({ tasks }: TaskListViewProps) {
    const navigate = useNavigate();
    const { pagination, filters, fetchTasks, setPagination, loading, deleteTask } = useTaskStore();
    const { page, limit, total } = pagination;
    const totalPages = Math.ceil(total / limit);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    // Fetch tasks when pagination or filters change (for list view)
    useEffect(() => {
        fetchTasks({ status: filters.status, priority: filters.priority, search: filters.search, page, limit });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, filters.status, filters.priority, filters.search]);

    const handleRowClick = (taskId: string) => {
        navigate({ to: '/tasks/$id', params: { id: taskId } });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPagination({ page: newPage });
    };

    const handleLimitChange = (newLimit: string) => {
        const limitValue = parseInt(newLimit, 10);
        setPagination({ limit: limitValue, page: 1 });
    };

    const handleGoToPage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const pageInput = formData.get('page') as string;
        const pageNumber = parseInt(pageInput, 10);
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
            handlePageChange(pageNumber);
        }
    };

    const handleView = (taskId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate({ to: '/tasks/$id', params: { id: taskId } });
    };

    const handleEdit = (taskId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate({ to: '/tasks/$id/edit', params: { id: taskId } });
    };

    const handleDeleteClick = (taskId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setTaskToDelete(taskId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!taskToDelete) return;
        try {
            await deleteTask(taskToDelete);
            // Refresh tasks after deletion
            fetchTasks({ status: filters.status, priority: filters.priority, search: filters.search, page, limit });
        } catch (error) {
            console.error('Failed to delete task:', error);
        } finally {
            setDeleteDialogOpen(false);
            setTaskToDelete(null);
        }
    };

    return (
        <div className="space-y-4">
            {loading && tasks.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <>
                    <div className="border rounded-lg overflow-hidden relative">
                        {loading && tasks.length > 0 && (
                            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        )}
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="min-w-[150px]">Title</TableHead>
                                        <TableHead className="min-w-[100px]">Status</TableHead>
                                        <TableHead className="min-w-[100px]">Priority</TableHead>
                                        <TableHead className="min-w-[120px] hidden sm:table-cell">Due Date</TableHead>
                                        <TableHead className="min-w-[120px] hidden md:table-cell">Created</TableHead>
                                        <TableHead className="min-w-[120px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tasks.length > 0 ? (
                                        tasks.map((task) => (
                                            <TableRow
                                                key={task.id}
                                                className="cursor-pointer"
                                                onClick={() => handleRowClick(task.id)}
                                            >
                                                <TableCell className="font-medium max-w-[200px] sm:max-w-none">
                                                    <span className="truncate block">{task.title}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={colorMap_selected[task.status] + ' text-xs'} >
                                                        {task.status.replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {task.priority ? (
                                                        <Badge className={colorMap_selected[task.priority] + ' text-xs'} >
                                                            {task.priority}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm hidden sm:table-cell">
                                                    {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : '-'}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                                                    {format(new Date(task.created_at), 'MMM dd, yyyy')}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={(e) => handleView(task.id, e)}
                                                            title="View task"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={(e) => handleEdit(task.id, e)}
                                                            title="Edit task"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                                            onClick={(e) => handleDeleteClick(task.id, e)}
                                                            title="Delete task"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                No tasks found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    {total > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground hidden sm:inline">Items per page:</span>
                                    <span className="text-sm text-muted-foreground sm:hidden">Per page:</span>
                                    <Select value={limit.toString()} onValueChange={handleLimitChange}>
                                        <SelectTrigger className="w-[80px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="20">20</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                            <SelectItem value="100">100</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} tasks
                                </span>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className="flex-1 sm:flex-initial"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="hidden sm:inline">Previous</span>
                                </Button>

                                <form onSubmit={handleGoToPage} className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground hidden sm:inline">Page</span>
                                    <Input
                                        name="page"
                                        type="number"
                                        min={1}
                                        max={totalPages}
                                        key={page}
                                        defaultValue={page}
                                        className="w-16 h-8 text-center"
                                    />
                                    <span className="text-sm text-muted-foreground">of {totalPages}</span>
                                </form>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page >= totalPages}
                                    className="flex-1 sm:flex-initial"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this task?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the task.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
