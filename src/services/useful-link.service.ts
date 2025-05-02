import { PaginatedResponse } from "../types/api";
import { UsefulLink } from "../types/useful-link";
import { ApiService } from "./api.service";

export class UsefulLinkService extends ApiService<UsefulLink> {
  constructor() {
    super("/useful-links");
  }

  async filter(title?: string): Promise<PaginatedResponse<UsefulLink[]>> {
    const response = await this.api.get<PaginatedResponse<UsefulLink[]>>(
      this.endpoint,
      {
        params: { page: 1, limit: 16, title },
        withCredentials: true,
      }
    );
    return response.data;
  }
}
