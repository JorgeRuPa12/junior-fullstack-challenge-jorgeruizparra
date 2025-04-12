import { Task } from "../entities/Task";

export interface TaskRepository {
  getTasks(): Promise<Task[]>;
  
  getTaskById(id: number): Promise<Task>;

  completeTask(id: number): Promise<void>;
  
  updatePriorityTask(id:number, priority: number): Promise<void>;

  createTask(name: string, description: string, date: Date): Promise<void>;

  deleteTask(id: number): Promise<void>;

  updateTask(id:number, name: string, description: string, date: Date): Promise<void>;
}