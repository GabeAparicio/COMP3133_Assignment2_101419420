import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as axios from 'axios';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-edit.html',
  styleUrl: './employee-edit.css'
})
export class EmployeeEdit implements OnInit {
  private graphqlUrl = 'http://localhost:4000/graphql';
  employeeId = '';

  employeeForm;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: [0, Validators.required],
      date_of_joining: [''],
      department: ['', Validators.required]
    });
  }

  formatDateForInput(value: any): string {
    if (!value) return '';

    const date = new Date(Number(value) || value);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.employeeId = id;

    const query = `
      query {
        getEmployeeById(eid: "${id}") {
          _id
          first_name
          last_name
          email
          gender
          designation
          salary
          date_of_joining
          department
        }
      }
    `;

    try {
      const response = await axios.default.post(this.graphqlUrl, { query });
      const employee = response.data.data.getEmployeeById;

      this.employeeForm.patchValue({
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        gender: employee.gender,
        designation: employee.designation,
        salary: employee.salary,
        date_of_joining: this.formatDateForInput(employee.date_of_joining),
        department: employee.department
      });

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Load employee for edit error:', error);
    }
  }

  async onSubmit() {
    const form = this.employeeForm.getRawValue();

    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const datePart = form.date_of_joining
      ? `date_of_joining: "${form.date_of_joining}"`
      : '';

    const mutation = `
    mutation {
      updateEmployee(
        eid: "${this.employeeId}"
        first_name: "${form.first_name}"
        last_name: "${form.last_name}"
        email: "${form.email}"
        gender: "${form.gender}"
        designation: "${form.designation}"
        salary: ${form.salary}
        ${datePart}
        department: "${form.department}"
      ) {
        _id
      }
    }
  `;

    try {
      await axios.default.post(this.graphqlUrl, { query: mutation });
      alert('Employee updated!');
      this.router.navigate(['/employees']);
    } catch (error) {
      console.error('Update employee error:', error);
    }
  }
}
