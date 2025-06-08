import { PaginatedResponse } from "../types/api";
import { Task } from "../types/task";
import { TaskPriority } from "../types/task-priority";
import { TaskStatus } from "../types/task-status";
import { ApiService } from "./api.service";

export class TaskService extends ApiService<Task> {
  constructor() {
    super("/tasks");
  }

  async filter(
    client?: string,
    status?: TaskStatus,
    priority?: TaskPriority
  ): Promise<PaginatedResponse<Task[]>> {
    const response = await this.api.get<PaginatedResponse<Task[]>>(
      this.endpoint,
      {
        params: { page: 1, limit: 16, client, status, priority },
        withCredentials: true,
      }
    );
    return response.data;
  }
}
