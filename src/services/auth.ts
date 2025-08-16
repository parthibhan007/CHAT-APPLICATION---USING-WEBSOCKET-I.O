import { AuthResponse } from '../types/chat';

const API_BASE_URL = 'http://localhost:3001/api';

class AuthService {
  private token: string | null = null;

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      this.token = data.token;
      localStorage.setItem('chat_token', data.token);
      localStorage.setItem('chat_user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      const data = await response.json();
      this.token = data.token;
      localStorage.setItem('chat_token', data.token);
      localStorage.setItem('chat_user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('chat_token');
    localStorage.removeItem('chat_user');
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('chat_token');
    }
    return this.token;
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('chat_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();