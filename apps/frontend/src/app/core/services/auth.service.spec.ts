import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest } from '../models';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should register a new user', () => {
      const registerData: RegisterRequest = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123'
      };

      const mockResponse = {
        user: {
          id: '1',
          email: registerData.email,
          username: registerData.username,
          role: 'user' as const,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        token: 'test-token'
      };

      service.register(registerData).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('auth_token')).toBe('test-token');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerData);
      req.flush(mockResponse);
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockResponse = {
        user: {
          id: '1',
          email: loginData.email,
          username: 'testuser',
          role: 'user' as const,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        token: 'test-token'
      };

      service.login(loginData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('token management', () => {
    it('should store token in localStorage', () => {
      service.setToken('test-token');
      expect(localStorage.getItem('auth_token')).toBe('test-token');
    });

    it('should retrieve token from localStorage', () => {
      localStorage.setItem('auth_token', 'test-token');
      expect(service.getToken()).toBe('test-token');
    });

    it('should remove token from localStorage', () => {
      localStorage.setItem('auth_token', 'test-token');
      service.removeToken();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should check if user is authenticated', () => {
      expect(service.isAuthenticated()).toBe(false);
      localStorage.setItem('auth_token', 'test-token');
      expect(service.isAuthenticated()).toBe(true);
    });
  });

  describe('logout', () => {
    it('should clear token and user on logout', () => {
      localStorage.setItem('auth_token', 'test-token');
      service.logout().subscribe(() => {
        expect(localStorage.getItem('auth_token')).toBeNull();
      });
    });
  });

  describe('currentUser$', () => {
    it('should emit current user updates', (done) => {
      service.currentUser$.subscribe(user => {
        if (user) {
          expect(user.email).toBe('test@example.com');
          done();
        }
      });

      const mockResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          role: 'user' as const,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        token: 'test-token'
      };

      service.login({ email: 'test@example.com', password: 'pass' }).subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockResponse);
    });
  });
});
