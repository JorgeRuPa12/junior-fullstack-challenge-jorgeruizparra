import { Task } from "../../domain/entities/Task";
import { TaskRepository } from "../../domain/repositories/TaskRepository";
import {
  geTasksFromApi,
  geTaskByIdFromApi,
  completeTaskFromApi,
  updatePriorityTaskFromApi,
  createTaskFromApi,
  deleteTaskFromApi,
  updateTaskFromApi,
} from "./taskApi";

export class TaskRepositoryImpl implements TaskRepository {
  async getTasks(): Promise<Task[]> {
    return await geTasksFromApi();
  }

  async getTaskById(id: number): Promise<Task> {
    return await geTaskByIdFromApi(id);
  }

  async completeTask(id: number): Promise<void> {
    return await completeTaskFromApi(id);
  }

  async updatePriorityTask(id: number, priority: number): Promise<void> {
    return await updatePriorityTaskFromApi(id, priority);
  }

  async createTask(name: string, description: string, date: Date): Promise<void> {
    return await createTaskFromApi(name, description, date);
  }

  async deleteTask(id: number): Promise<void> {
    return await deleteTaskFromApi(id);
  }

  async updateTask(id: number, name: string, description: string, date: Date): Promise<void> {
    return await updateTaskFromApi(id, name, description, date);
  }
}