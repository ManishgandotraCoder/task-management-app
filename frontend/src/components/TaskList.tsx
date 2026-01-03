import { useEffect, useState } from 'react';
import { Link, useSearch, useNavigate } from '@tanstack/react-router';
import { useTaskStore } from '@/store/taskStore';
import { TaskStatus, TaskPriority } from '@/api/tasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Plus, Loader2, List, Grid, LayoutGrid } from 'lucide-react';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TaskListView } from '@/components/TaskListView';
import { TaskGridView } from '@/components/TaskGridView';
import { useDebounce } from '@/hooks/useDebounce';

type ViewType = 'list' | 'grid' | 'kanban';

export function TaskList() {
    const { tasks, loading, error, filters, fetchTasks, setFilters, setPagination, updateTask } = useTaskStore();
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    const navigate = useNavigate({ from: '/' });
    const search = useSearch({ from: '/' });
    const currentView = (search.view as ViewType) || 'list';

    const handleViewChange = (view: ViewType) => {
        // Reset pagination when switching views
        setPagination({ page: 1, limit: 20 });
        navigate({ search: { view } as never });
    };

    // Reset pagination when view changes
    useEffect(() => {
        const limit = currentView === 'grid' ? 20 : currentView === 'kanban' ? 100 : 20;
        setPagination({ page: 1, limit });
    }, [currentView, setPagination]);

    // Update filters when debounced search query changes
    useEffect(() => {
        setFilters({ search: debouncedSearchQuery || undefined });
        setPagination({ page: 1 });
    }, [debouncedSearchQuery, setFilters, setPagination]);

    useEffect(() => {
        // Fetch tasks based on view type
        // List view: TaskListView component handles fetching via its useEffect
        // Grid view: starts with 20 items, loads more on scroll
        // Kanban view: loads 100 items for board display
        if (currentView === 'list') {
            // Trigger initial fetch for list view (TaskListView will handle subsequent fetches)
            const limit = 20;
            fetchTasks({ status: filters.status, priority: filters.priority, search: filters.search, page: 1, limit });
            return;
        }
        const limit = currentView === 'kanban' ? 100 : 20;
        fetchTasks({ status: filters.status, priority: filters.priority, search: filters.search, page: 1, limit });
    }, [filters.status, filters.priority, filters.search, currentView, fetchTasks]);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
    };

    const handleStatusFilter = (status: string) => {
        setFilters({ status: status === 'all' ? undefined : (status as TaskStatus) });
        setPagination({ page: 1 });
    };

    const handlePriorityFilter = (priority: string) => {
        setFilters({ priority: priority === 'all' ? undefined : (priority as TaskPriority) });
        setPagination({ page: 1 });
    };

    const handleTaskMove = async (taskId: string, newStatus: TaskStatus) => {
        try {
            await updateTask(taskId, { status: newStatus });
        } catch (error) {
            console.error('Failed to move task:', error);
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold">Tasks</h1>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center border rounded-md flex-1 sm:flex-initial">
                        <Button
                            variant={currentView === 'list' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => handleViewChange('list')}
                            className="rounded-r-none flex-1 sm:flex-initial"
                            title="List view"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={currentView === 'grid' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => handleViewChange('grid')}
                            className="rounded-none border-x flex-1 sm:flex-initial"
                            title="Grid view"
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={currentView === 'kanban' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => handleViewChange('kanban')}
                            className="rounded-l-none flex-1 sm:flex-initial"
                            title="Kanban view"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                    </div>
                    <Link to="/tasks/new" className="flex-1 sm:flex-initial">
                        <Button className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">New Task</span>
                            <span className="sm:hidden">New</span>
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={filters.status || 'all'} onValueChange={handleStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value={TaskStatus.PENDING}>Pending</SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                        <SelectItem value={TaskStatus.COMPLETED}>Completed</SelectItem>
                        <SelectItem value={TaskStatus.CANCELLED}>Cancelled</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filters.priority || 'all'} onValueChange={handlePriorityFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                        <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                        <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {currentView !== 'list' && loading ? (
                <div className="flex items-center justify-center py-12" role="status" aria-label="Loading tasks">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : tasks.length === 0 && !loading ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">No tasks found. Create your first task!</p>
                        <Link to="/tasks/new" className="mt-4 inline-block">
                            <Button>Create Task</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {(currentView === 'list' || !currentView) && <TaskListView tasks={tasks} />}
                    {currentView === 'grid' && <TaskGridView tasks={tasks} />}
                    {currentView === 'kanban' && <KanbanBoard tasks={tasks} onTaskMove={handleTaskMove} />}
                </>
            )}
        </div>
    );
}

