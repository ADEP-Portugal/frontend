import { PaginatedResponse } from "../types/api";
import { Lawsuit } from "../types/lawsuit";
import { PeriodFilter } from "../types/period-filter";
import { ApiService } from "./api.service";

export class LawsuitService extends ApiService<Lawsuit> {
  constructor() {
    super("/lawsuits");
  }

  async filter(
    client?: string,
    period?: PeriodFilter,
    showArchived?: boolean
  ): Promise<PaginatedResponse<Lawsuit[]>> {
    const response = await this.api.get<PaginatedResponse<Lawsuit[]>>(
      this.endpoint,
      {
        params: { page: 1, limit: 16, client, period, archived: showArchived },
        withCredentials: true,
      }
    );
    return response.data;
  }

  async fetchSummary(): Promise<Lawsuit[]> {
    const response = await this.api.get<Lawsuit[]>(`${this.endpoint}/summary`, {
      withCredentials: true,
    });
    return response.data;
  }
}
