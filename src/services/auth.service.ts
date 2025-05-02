import { LoginPayload, LoginResponse } from "../types/login";
import { ResetPasswordPayload } from "../types/reset-password";
import { SignupPayload } from "../types/signup";
import { User } from "../types/user";
import { ApiService } from "./api.service";

export class AuthService extends ApiService<User> {
  constructor() {
    super("/auth");
  }

  async login(data: LoginPayload): Promise<User> {
    const response = await this.api.post<User>(`${this.endpoint}/login`, data, {
      withCredentials: true,
    });
    return response.data;
  }

  async getUserWithToken(): Promise<User> {
    const response = await this.api.get<User>(this.endpoint, {
      withCredentials: true,
    });
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

  async logout(): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>(
      `${this.endpoint}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
}
