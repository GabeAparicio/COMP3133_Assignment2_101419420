import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as axios from 'axios';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-add.html',
  styleUrl: './employee-add.css'
})
export class EmployeeAdd {
  private graphqlUrl = 'http://localhost:4000/graphql';

  employeeForm;
  selectedFile: File | null = null;
  uploadedImageUrl = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: [0, Validators.required],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required]
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile);
  }

  async onSubmit() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const form = this.employeeForm.value;

    try {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('image', this.selectedFile);

        const uploadResponse = await axios.default.post(
          'http://localhost:4000/upload',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );

        this.uploadedImageUrl = uploadResponse.data.url;
        console.log('Uploaded image URL:', this.uploadedImageUrl);
      }

      const mutation = `
        mutation {
          addEmployee(
            first_name: "${form.first_name}"
            last_name: "${form.last_name}"
            email: "${form.email}"
            gender: "${form.gender}"
            designation: "${form.designation}"
            salary: ${form.salary}
            date_of_joining: "${form.date_of_joining}"
            department: "${form.department}"
            employee_photo: "${this.uploadedImageUrl}"
          ) {
            _id
          }
        }
      `;

      await axios.default.post(this.graphqlUrl, { query: mutation });
      alert('Employee added!');
      this.router.navigate(['/employees']);
    } catch (error) {
      console.error('Add employee error:', error);
    }
  }
}
