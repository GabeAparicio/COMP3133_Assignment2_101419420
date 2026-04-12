import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { EmployeeList } from './pages/employee-list/employee-list';
import { EmployeeAdd } from './pages/employee-add/employee-add';
import { EmployeeEdit } from './pages/employee-edit/employee-edit';
import { EmployeeDetails } from './pages/employee-details/employee-details'
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: 'login', component: Login },
    { path: 'signup', component: Signup },

    { path: 'employees', component: EmployeeList, canActivate: [authGuard] },
    { path: 'employees/add', component: EmployeeAdd, canActivate: [authGuard] },
    { path: 'employees/edit/:id', component: EmployeeEdit, canActivate: [authGuard] },
    { path: 'employees/:id', component: EmployeeDetails, canActivate: [authGuard] },

    { path: '**', redirectTo: 'login' }
];
