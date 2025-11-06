export interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'organizer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
