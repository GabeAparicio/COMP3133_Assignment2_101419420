import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  constructor(
      public authService: AuthService,
      private router: Router
  ) {}

  goToEmployees() {
    this.router.navigate(['/employees']);
  }

  goToAdd() {
    this.router.navigate(['/employees/add']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
