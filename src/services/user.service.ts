import { User } from "../types/user";
import { ApiService } from "./api.service";

export class UserService extends ApiService<User> {
  constructor() {
    super("/users");
  }

  async filter(name?: string): Promise<User[]> {
    if (name) {
      this.endpoint += `?name=${name}`;
    }
    return await this.fetchAll();
  }
}
