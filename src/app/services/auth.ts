import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(email: string, password: string): boolean {
    if (email && password) {
      localStorage.setItem('token', 'dummy-token');
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
