import { TaskRepository } from "../../domain/repositories/TaskRepository";

export class CreateTask {
    private taskRepository: TaskRepository;

    constructor(taskRepository: TaskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(name: string, description: string, date: Date): Promise<void> {
        return await this.taskRepository.createTask(name, description, date);
    }
}