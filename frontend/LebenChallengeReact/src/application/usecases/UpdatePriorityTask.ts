import { TaskRepository } from "../../domain/repositories/TaskRepository";

export class UpdatePriorityTask {
    private taskRepository: TaskRepository;

    constructor(taskRepository: TaskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(id: number, priority: number): Promise<void> {
        return await this.taskRepository.updatePriorityTask(id, priority);
    }
}