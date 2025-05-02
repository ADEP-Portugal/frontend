import { PaginatedResponse } from "../types/api";
import { Appointment } from "../types/appointment";
import { PeriodFilter } from "../types/period-filter";
import { ApiService } from "./api.service";

export class AppointmentService extends ApiService<Appointment> {
  constructor() {
    super("/appointments");
  }

  async filter(
    client?: string,
    period?: PeriodFilter
  ): Promise<PaginatedResponse<Appointment[]>> {
    const response = await this.api.get<PaginatedResponse<Appointment[]>>(
      this.endpoint,
      {
        params: { page: 1, limit: 16, client, period },
        withCredentials: true,
      }
    );
    return response.data;
  }
}
