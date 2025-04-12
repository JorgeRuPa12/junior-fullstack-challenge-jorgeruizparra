import { Task } from "../../domain/entities/Task"
import { TaskRepository } from "../../domain/repositories/TaskRepository";

export class GetTasks {
    private taskRepository: TaskRepository;

    constructor(taskRepository: TaskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(): Promise<Task[]> {
        return await this.taskRepository.getTasks();
    }
}