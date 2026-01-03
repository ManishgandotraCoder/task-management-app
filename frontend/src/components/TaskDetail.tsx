import { useEffect } from 'react';
import {
    useParams,
    Link,
    useNavigate,
    Outlet,
    useRouterState,
} from '@tanstack/react-router';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Trash2, Loader2 } from 'lucide-react';

import { useTaskStore } from '@/store/taskStore';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { colorMap_selected } from '@/utils/helper';

export function TaskDetail() {
    const { id } = useParams({ from: '/tasks/$id' });
    const navigate = useNavigate();
    const router = useRouterState();

    const {
        selectedTask,
        loading,
        error,
        fetchTaskById,
        deleteTask,
    } = useTaskStore();

    const isEditRoute = router.location.pathname.endsWith('/edit');

    useEffect(() => {
        if (id) fetchTaskById(id);
    }, [id, fetchTaskById]);

    const handleDelete = async () => {
        if (!id) return;
        await deleteTask(id);
        navigate({ to: '/' });
    };

    /* ---------- ROUTE HANDLING ---------- */

    if (isEditRoute) return <Outlet />;

    if (loading) {
        return (
            <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !selectedTask) {
        return (
            <Card className="mx-auto max-w-xl">
                <CardContent className="py-12 text-center space-y-4">
                    <p className="text-destructive">
                        {error ?? 'Task not found'}
                    </p>
                    <Link to="/">
                        <Button>Back to Tasks</Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    /* ---------- UI ---------- */

    return (
        <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8 px-4 sm:px-0">
            {/* Top Navigation */}
            <div className="flex items-center gap-2 sm:gap-4">
                <Link to="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-lg sm:text-xl font-semibold">Task Details</h2>
            </div>

            <Card>
                <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Task Overview</CardTitle>
                        <CardDescription>
                            Complete details of the task
                        </CardDescription>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <Link to="/tasks/$id/edit" params={{ id }} className="flex-1 sm:flex-initial">
                            <Button size="sm" variant="outline" className="w-full sm:w-auto">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive" className="flex-1 sm:flex-initial">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete this task?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 sm:space-y-8">
                    {/* ✅ TITLE + STATUS + PRIORITY (AS REQUESTED) */}
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                            {selectedTask.title}
                        </h1>

                        <div className="mt-2 flex flex-wrap gap-2">
                            <Badge className={colorMap_selected[selectedTask.status] + ' text-xs'} >
                                {selectedTask.status}
                            </Badge>

                            {selectedTask.priority && (
                                <Badge className={colorMap_selected[selectedTask.priority] + ' text-xs'} >
                                    {selectedTask.priority} Priority
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {selectedTask.description && (
                        <section className="rounded-lg border bg-muted/40 p-4">
                            <h3 className="mb-2 font-semibold">Description</h3>
                            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                {selectedTask.description}
                            </p>
                        </section>
                    )}

                    {/* Metadata */}
                    <div className="grid gap-4 md:grid-cols-3">
                        {selectedTask.due_date && (
                            <MetaItem
                                label="Due Date"
                                value={format(
                                    new Date(selectedTask.due_date),
                                    'PPpp'
                                )}
                            />
                        )}

                        <MetaItem
                            label="Created"
                            value={format(
                                new Date(selectedTask.created_at),
                                'PPpp'
                            )}
                        />

                        <MetaItem
                            label="Last Updated"
                            value={format(
                                new Date(selectedTask.updated_at),
                                'PPpp'
                            )}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

/* ---------- UI Helper ---------- */

function MetaItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-lg border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            <p className="mt-1 text-sm font-medium">{value}</p>
        </div>
    );
}
