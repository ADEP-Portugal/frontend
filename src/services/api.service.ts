import api from "../lib/axios";
import { ApiResponse, PaginatedResponse } from "../types/api";

export class ApiService<T> {
  protected api = api;
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async fetchAll(): Promise<T[]> {
    const response = await this.api.get<T[]>(this.endpoint);
    return response.data;
  }

  async fetchById(id: string | number): Promise<ApiResponse<T>> {
    const response = await this.api.get<ApiResponse<T>>(
      `${this.endpoint}/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    const response = await this.api.post<ApiResponse<T>>(this.endpoint, data, {
      withCredentials: true,
    });
    return response.data;
  }

  async update(id: string | number, data: Partial<T>): Promise<ApiResponse<T>> {
    const response = await this.api.put<ApiResponse<T>>(
      `${this.endpoint}/${id}`,
      data,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }

  async delete(id: string | number): Promise<ApiResponse<void>> {
    const response = await this.api.delete<ApiResponse<void>>(
      `${this.endpoint}/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }

  async fetchPaginated(
    page: number,
    limit: number
  ): Promise<PaginatedResponse<T[]>> {
    const response = await this.api.get<PaginatedResponse<T[]>>(this.endpoint, {
      params: { page, limit },
      withCredentials: true,
    });
    return response.data;
  }
}
