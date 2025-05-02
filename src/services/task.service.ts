import { PaginatedResponse } from "../types/api";
import { Task } from "../types/task";
import { ApiService } from "./api.service";

export class TaskService extends ApiService<Task> {
  constructor() {
    super("/tasks");
  }

  async filter(
    client?: string
  ): Promise<PaginatedResponse<Task[]>> {
    const response = await this.api.get<PaginatedResponse<Task[]>>(
      this.endpoint,
      {
        params: { page: 1, limit: 16, client },
        withCredentials: true,
      }
    );
    return response.data;
  }
}
