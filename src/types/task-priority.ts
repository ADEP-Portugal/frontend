export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export function getTaskLabel(priority: TaskPriority): string {
    switch (priority) {
        case TaskPriority.LOW:
            return 'Baixa';
        case TaskPriority.MEDIUM:
            return 'Média';
        case TaskPriority.HIGH:
            return 'Alta';
        default:
            return 'Baixa';
    }
}

export function getTaskTextPriorityColor(priority: TaskPriority): string {
    switch (priority) {
        case TaskPriority.LOW:
            return 'text-lime-500';
        case TaskPriority.MEDIUM:
            return 'text-yellow-400';
        case TaskPriority.HIGH:
            return 'text-rose-500';
        default:
            return 'gray';
    }
}

export function getTaskBorderPriorityColor(priority: TaskPriority): string {
    switch (priority) {
        case TaskPriority.LOW:
            return 'border-lime-500';
        case TaskPriority.MEDIUM:
            return 'border-yellow-400';
        case TaskPriority.HIGH:
            return 'border-rose-500';
        default:
            return 'gray';
    }
}

export function getTaskIconPriorityColor(priority: TaskPriority): string {
    switch (priority) {
        case TaskPriority.LOW:
            return '#7CCF00';
        case TaskPriority.MEDIUM:
            return '#FDC700';
        case TaskPriority.HIGH:
            return '#FF2056';
        default:
            return 'gray';
    }
}