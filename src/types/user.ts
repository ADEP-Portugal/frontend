export interface User {
  id?: string;

  email: string;

  fullName: string;

  imageUrl?: string | null;

  passwordHash?: string;
}
