import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import * as axios from 'axios';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeList implements OnInit {
  employees: any[] = [];
  errorMessage = '';
  loading = true;

  searchDepartment = '';
  searchDesignation = '';

  private graphqlUrl = 'http://localhost:4000/graphql';

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadAll();
  }

  async loadAll() {
    try {
      this.loading = true;
      this.errorMessage = '';

      const data = await this.employeeService.getEmployees();
      this.employees = data;
      this.loading = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Employee load error:', error);
      this.errorMessage = 'Failed to load employees.';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async search() {
    try {
      this.loading = true;
      this.errorMessage = '';

      const query = `
        query {
          searchEmployees(
            department: ${this.searchDepartment ? `"${this.searchDepartment}"` : null}
            designation: ${this.searchDesignation ? `"${this.searchDesignation}"` : null}
          ) {
            _id
            first_name
            last_name
            email
            department
            designation
          }
        }
      `;

      const response = await axios.default.post(this.graphqlUrl, { query });
      this.employees = response.data.data.searchEmployees;
      this.loading = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Search error:', error);
      this.errorMessage = 'Failed to search employees.';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  viewEmployee(id: string) {
    this.router.navigate(['/employees', id]);
  }
  goToAddEmployee() {
    this.router.navigate(['/employees/add']);
  }

  editEmployee(id: string) {
    this.router.navigate(['/employees/edit', id]);
  }

  async deleteEmployee(id: string) {
    const confirmDelete = confirm('Are you sure you want to delete this employee?');
    if (!confirmDelete) return;

    try {
      await this.employeeService.deleteEmployee(id);
      this.employees = this.employees.filter(emp => emp._id !== id);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Delete error:', error);
    }
  }
}
