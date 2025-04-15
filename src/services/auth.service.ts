import { LoginPayload, LoginResponse } from "../types/login";
import { ResetPasswordPayload } from "../types/reset-password";
import { SignupPayload } from "../types/signup";
import { User } from "../types/user";
import { ApiService } from "./api.service";

export class AuthService extends ApiService<User> {
  constructor() {
    super("/auth");
  }

  async login(data: LoginPayload): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>(
      `${this.endpoint}/login`,
      data
    );
    return response.data;
  }

  async refresh(): Promise<LoginResponse> {
    const response = await this.api.get<LoginResponse>(
      `${this.endpoint}/refresh`,
      { withCredentials: true }
    );
    return response.data;
  }

  async signup(data: SignupPayload): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>(
      `${this.endpoint}/signup`,
      data
    );
    return response.data;
  }

  async forgotPassword(email: string): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>(
      `${this.endpoint}/forgot-password/${email}`
    );
    return response.data;
  }

  async resetPassword(data: ResetPasswordPayload): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>(
      `${this.endpoint}/reset-password`,
      data
    );
    return response.data;
  }
}
