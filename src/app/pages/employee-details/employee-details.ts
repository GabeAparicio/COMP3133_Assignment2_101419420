import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as axios from 'axios';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css'
})
export class EmployeeDetails implements OnInit {
  private graphqlUrl = 'http://localhost:4000/graphql';

  employee: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

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
          department
        }
      }
    `;

    try {
      const response = await axios.default.post(this.graphqlUrl, { query });
      this.employee = response.data.data.getEmployeeById;
      this.loading = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error(error);
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
