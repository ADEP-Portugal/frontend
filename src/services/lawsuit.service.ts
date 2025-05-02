import { PaginatedResponse } from "../types/api";
import { Lawsuit } from "../types/lawsuit";
import { ApiService } from "./api.service";

export class LawsuitService extends ApiService<Lawsuit> {
  constructor() {
    super("/lawsuits");
  }

  async filter(client?: string): Promise<PaginatedResponse<Lawsuit[]>> {
    const response = await this.api.get<PaginatedResponse<Lawsuit[]>>(
      this.endpoint,
      {
        params: { page: 1, limit: 16, client },
        withCredentials: true,
      }
    );
    return response.data;
  }

  async fetchSummary(): Promise<Lawsuit[]> {
    const response = await this.api.get<Lawsuit[]>(
      `${this.endpoint}/summary`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
}
