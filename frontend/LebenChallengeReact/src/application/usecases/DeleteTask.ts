import { TaskRepository } from "../../domain/repositories/TaskRepository";

export class DeleteTask {
    private taskRepository: TaskRepository;

    constructor(taskRepository: TaskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(id: number): Promise<void> {
        return await this.taskRepository.deleteTask(id);
    }
}