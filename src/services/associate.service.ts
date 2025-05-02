import { PaginatedResponse } from "../types/api";
import { Associate } from "../types/associate";
import { ApiService } from "./api.service";

export class AssociateService extends ApiService<Associate> {
  constructor() {
    super("/associates");
  }

  async filter(name?: string): Promise<PaginatedResponse<Associate[]>> {
    const response = await this.api.get<PaginatedResponse<Associate[]>>(
      this.endpoint,
      {
        params: { page: 1, limit: 16, name },
        withCredentials: true,
      }
    );
    return response.data;
  }

  async fetchSummary(): Promise<Associate[]> {
    const response = await this.api.get<Associate[]>(
      `${this.endpoint}/summary`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }

  async getTomorrowBirthday(): Promise<Associate[]> {
    const response = await this.api.get<Associate[]>(
      `${this.endpoint}?birthday=tomorrow`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }

  async getExpirationDocuments(): Promise<Associate[]> {
    const response = await this.api.get<Associate[]>(
      `${this.endpoint}/expiry-date`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }

  async filterAll(
    name?: string,
    phone?: string,
    associateNumber?: string
  ): Promise<Associate[]> {
    const response = await this.api.get<Associate[]>(this.endpoint, {
      params: { name, phone, associateNumber },
      withCredentials: true,
    });
    return response.data;
  }
}
