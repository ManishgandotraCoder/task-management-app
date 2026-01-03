import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CalendarIcon, Check, Loader2 } from "lucide-react"
import { createTaskSchema, type CreateTaskFormData } from "@/lib/schemas"
import { useTaskStore } from "@/store/taskStore"
import { TaskStatus, TaskPriority } from "@/api/tasks"

type Status = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
type Priority = "HIGH" | "MEDIUM" | "LOW"

export default function CreateTaskForm() {
    const navigate = useNavigate()
    const { createTask, loading, error } = useTaskStore()

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CreateTaskFormData>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title: "",
            description: "",
            status: TaskStatus.PENDING,
            priority: null,
            due_date: "",
        },
    })

    const title = watch("title")
    const status = watch("status") as Status
    const priority = watch("priority") as Priority | null

    useEffect(() => {
        document.getElementById("title")?.focus()
    }, [])

    const onSubmit = async (data: CreateTaskFormData) => {
        try {
            const task = await createTask({
                title: data.title,
                description: data.description,
                status: data.status || TaskStatus.PENDING,
                priority: data.priority ?? undefined,
                due_date: data.due_date || undefined,
            })
            navigate({ to: "/tasks/$id", params: { id: task.id } })
        } catch (error) {
            // Error is handled by the store
            console.error("Failed to create task:", error)
        }
    }

    const isDisabled = loading || isSubmitting

    return (
        <Card className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Create New Task</h2>
                <p className="text-sm text-muted-foreground">
                    Add a new task to your workspace
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <div className="space-y-1">
                    <Label htmlFor="title" className="text-sm font-medium">
                        Title *
                    </Label>
                    <Input
                        id="title"
                        {...register("title")}
                        maxLength={255}
                        placeholder="e.g. Complete project documentation"
                        className={cn(errors.title && "border-destructive")}
                    />
                    <div className="flex justify-between items-center">
                        <div className="text-xs text-destructive">
                            {errors.title?.message}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {title?.length || 0} / 255
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                    <Label htmlFor="description" className="text-sm font-medium">
                        Description
                    </Label>
                    <Textarea
                        id="description"
                        {...register("description")}
                        placeholder="Add details, steps, or links..."
                        className={cn(
                            "transition-all focus:min-h-[120px]",
                            errors.description && "border-destructive"
                        )}
                    />
                    {errors.description && (
                        <div className="text-xs text-destructive">
                            {errors.description.message}
                        </div>
                    )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="flex gap-2 flex-wrap">
                        {(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as Status[]).map(
                            (s) => (
                                <Pill
                                    key={s}
                                    active={status === s}
                                    onClick={() => setValue("status", s as TaskStatus)}
                                    variant={s}
                                    disabled={isDisabled}
                                >
                                    {s.replace("_", " ")}
                                </Pill>
                            )
                        )}
                    </div>
                    {errors.status && (
                        <div className="text-xs text-destructive">
                            {errors.status.message}
                        </div>
                    )}
                </div>

                {/* Priority */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Priority</Label>
                    <div className="flex gap-2">
                        {(["HIGH", "MEDIUM", "LOW"] as Priority[]).map((p) => (
                            <Pill
                                key={p}
                                active={priority === p}
                                onClick={() => setValue("priority", p === priority ? null : (p as TaskPriority))}
                                variant={p}
                                disabled={isDisabled}
                            >
                                {p}
                            </Pill>
                        ))}
                    </div>
                    {errors.priority && (
                        <div className="text-xs text-destructive">
                            {errors.priority.message}
                        </div>
                    )}
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                    <Label htmlFor="due_date" className="text-sm font-medium">
                        Due Date
                    </Label>
                    <div className="flex gap-2 items-center">
                        <Input
                            id="due_date"
                            type="date"
                            {...register("due_date")}
                            className={cn(errors.due_date && "border-destructive")}
                        />
                        <CalendarIcon className="text-muted-foreground" />
                    </div>
                    <div className="flex gap-2 text-xs">
                        <QuickDate
                            label="Today"
                            days={0}
                            setDate={(date) => setValue("due_date", date)}
                            disabled={isDisabled}
                        />
                        <QuickDate
                            label="Tomorrow"
                            days={1}
                            setDate={(date) => setValue("due_date", date)}
                            disabled={isDisabled}
                        />
                        <QuickDate
                            label="Next Week"
                            days={7}
                            setDate={(date) => setValue("due_date", date)}
                            disabled={isDisabled}
                        />
                    </div>
                    {errors.due_date && (
                        <div className="text-xs text-destructive">
                            {errors.due_date.message}
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Link to="/">
                        <Button type="button" variant="outline" disabled={isDisabled}>
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isDisabled}>
                        {isSubmitting || loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Create Task
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    )
}

/* ---------- Helpers ---------- */

function Pill({
    children,
    active,
    onClick,
    variant,
    disabled,
}: {
    children: React.ReactNode
    active?: boolean
    onClick: () => void
    variant: string
    disabled?: boolean
}) {
    // Map variants to Badge styling with Shadcn patterns
    const getVariantStyles = (variant: string, isActive: boolean) => {
        if (isActive) {
            const activeMap: Record<string, string> = {
                PENDING: "bg-yellow-600 text-yellow-50 border-yellow-600",
                IN_PROGRESS: "bg-blue-600 text-blue-50 border-blue-600",
                COMPLETED: "bg-green-600 text-green-50 border-green-600",
                CANCELLED: "bg-red-600 text-red-50 border-red-600",
                HIGH: "bg-red-600 text-red-50 border-red-600",
                MEDIUM: "bg-orange-600 text-orange-50 border-orange-600",
                LOW: "bg-green-600 text-green-50 border-green-600",
            }
            return activeMap[variant] || ""
        } else {
            const inactiveMap: Record<string, string> = {
                PENDING: "bg-yellow-50 text-yellow-700 border-yellow-300",
                IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-300",
                COMPLETED: "bg-green-50 text-green-700 border-green-300",
                CANCELLED: "bg-red-50 text-red-700 border-red-300",
                HIGH: "bg-red-50 text-red-700 border-red-300",
                MEDIUM: "bg-orange-50 text-orange-700 border-orange-300",
                LOW: "bg-green-50 text-green-700 border-green-300",
            }
            return inactiveMap[variant] || ""
        }
    }

    return (
        <Badge
            onClick={disabled ? undefined : onClick}
            className={cn(
                "cursor-pointer transition-all hover:opacity-80 px-3 py-1",
                disabled && "opacity-50 cursor-not-allowed",
                getVariantStyles(variant, active || false)
            )}
            role="button"
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
                if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    onClick()
                }
            }}
        >
            {children}
        </Badge>
    )
}

function QuickDate({
    label,
    days,
    setDate,
    disabled,
}: {
    label: string
    days: number
    setDate: (v: string) => void
    disabled?: boolean
}) {
    return (
        <Button
            type="button"
            onClick={() => {
                const d = new Date()
                d.setDate(d.getDate() + days)
                setDate(d.toISOString().split("T")[0])
            }}
            disabled={disabled}
            variant="outline"
            size="sm"
            className="h-auto px-2 py-1 text-xs"
        >
            {label}
        </Button>
    )
}
