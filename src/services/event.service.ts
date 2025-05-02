import { PaginatedResponse } from "../types/api";
import { Event } from "../types/event";
import { PeriodFilter } from "../types/period-filter";
import { ApiService } from "./api.service";

export class EventService extends ApiService<Event> {
  constructor() {
    super("/events");
  }

  async filter(
    name?: string,
    period?: PeriodFilter
  ): Promise<PaginatedResponse<Event[]>> {
    const response = await this.api.get<PaginatedResponse<Event[]>>(
      this.endpoint,
      {
        params: { page: 1, limit: 16, name, period },
        withCredentials: true,
      }
    );
    return response.data;
  }
}
