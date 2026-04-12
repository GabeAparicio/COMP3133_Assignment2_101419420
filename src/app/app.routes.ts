import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { EmployeeList } from './pages/employee-list/employee-list';
import { EmployeeAdd } from './pages/employee-add/employee-add';
import { EmployeeEdit } from './pages/employee-edit/employee-edit';
import { EmployeeDetails } from './pages/employee-details/employee-details';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: 'login', component: Login },
    { path: 'signup', component: Signup },

    { path: 'employees', component: EmployeeList },
    { path: 'employees/add', component: EmployeeAdd },
    { path: 'employees/edit/:id', component: EmployeeEdit },
    { path: 'employees/:id', component: EmployeeDetails },

    { path: '**', redirectTo: 'login' }
];
