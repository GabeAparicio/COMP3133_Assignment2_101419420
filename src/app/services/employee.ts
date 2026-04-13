import { Injectable } from '@angular/core';
import * as axios from 'axios';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private graphqlUrl = 'http://localhost:4000/graphql';

  async getEmployees() {
    const query = `
    query {
      getAllEmployees {
        _id
        first_name
        last_name
        email
        department
        employee_photo
      }
    }
  `;

    try {
      const response = await axios.default.post(this.graphqlUrl, { query });
      console.log('GraphQL response:', response.data);
      return response.data.data.getAllEmployees;
    } catch (error: any) {
      console.log('Full GraphQL error JSON:', JSON.stringify(error.response?.data, null, 2));
      throw error;
    }
  }
  async deleteEmployee(id: string) {
    const mutation = `
    mutation {
      deleteEmployee(eid: "${id}")
    }
  `;

    const response = await axios.default.post(this.graphqlUrl, { query: mutation });
    return response.data.data.deleteEmployee;
  }
}
