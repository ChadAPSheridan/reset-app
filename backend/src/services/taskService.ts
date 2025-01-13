export class TaskService {
    private tasks: any[] = []; // This will hold the tasks in memory for now

    public addTask(title: string, description: string, userId: number): void {
        const newTask = {
            id: this.tasks.length + 1,
            title,
            description,
            status: 'To Do',
            userId,
        };
        this.tasks.push(newTask);
    }

    public getTasks(): any[] {
        return this.tasks;
    }

    public updateTask(id: number, updatedData: Partial<{ title: string; description: string; status: string; }>): void {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedData };
        }
    }

    public deleteTask(id: number): void {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }
}

export function getTasks() {
    throw new Error('Function not implemented.');
}
