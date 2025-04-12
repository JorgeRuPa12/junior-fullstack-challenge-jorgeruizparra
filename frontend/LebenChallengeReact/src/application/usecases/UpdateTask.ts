import { TaskRepository } from "../../domain/repositories/TaskRepository";

export class UpdateTask {
    private taskRepository: TaskRepository;

    constructor(taskRepository: TaskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(id: number, name: string, description: string, date: Date): Promise<void> {
        return await this.taskRepository.updateTask(id, name, description, date);
    }
}