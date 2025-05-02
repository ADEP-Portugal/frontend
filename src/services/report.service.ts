import { PeriodFilter } from "../types/period-filter";
import { Report } from "../types/report";
import { ApiService } from "./api.service";

export class ReportService extends ApiService<Report> {
  constructor() {
    super("/reports");
  }

  async generateReport(
    date?: Date,
    period?: PeriodFilter
  ): Promise<Report> {
    const response = await this.api.get<Report>(
      this.endpoint,
      {
        params: { date, period },
        withCredentials: true,
      }
    );
    return response.data;
  }
}
