import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<AuthResponse> {
    // TODO: Integrate with backend API
    // return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
    
    // Stub implementation
    return of({
      user: {
        id: '1',
        email: data.email,
        username: data.username,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      token: 'mock-jwt-token'
    });
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    // TODO: Integrate with backend API
    // return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
    
    // Stub implementation
    return of({
      user: {
        id: '1',
        email: data.email,
        username: 'mockuser',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      token: 'mock-jwt-token'
    });
  }

  logout(): Observable<void> {
    // TODO: Integrate with backend API
    // return this.http.post<void>(`${this.apiUrl}/logout`, {});
    
    // Stub implementation
    return of(undefined);
  }

  getCurrentUser(): Observable<AuthResponse> {
    // TODO: Integrate with backend API
    // return this.http.get<AuthResponse>(`${this.apiUrl}/me`);
    
    // Stub implementation
    const token = this.getToken();
    if (token) {
      return of({
        user: {
          id: '1',
          email: 'user@example.com',
          username: 'mockuser',
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        token: token
      });
    }
    throw new Error('Not authenticated');
  }

  // Local storage helpers
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
