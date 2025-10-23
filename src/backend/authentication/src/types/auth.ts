export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
  }
  
  export interface AuthResponse {
    user: Omit<User, 'password'>;
    token: string;
  }
  
  export interface JWTPayload {
    userId: string;
  }