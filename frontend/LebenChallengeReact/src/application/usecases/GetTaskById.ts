import { Task } from "../../domain/entities/Task"
import { TaskRepository } from "../../domain/repositories/TaskRepository";

export class GetTaskById {
    private taskRepository: TaskRepository;

    constructor(taskRepository: TaskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(id: number): Promise<Task> {
        return await this.taskRepository.getTaskById(id);
    }
}