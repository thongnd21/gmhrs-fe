import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { CompanyManagerGuard } from './shared/guard/company-manager.gruad';
import { SystemAdminGuard } from './shared/guard/system-admin.gruad';

export const AppRoutes: Routes = [
  { path: '', loadChildren: () => import('./login/login.module')
  .then(m => m.LoginModule) },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'company',
        loadChildren:
          () => import('./components/company/company.module').then(m => m.CompanyModule),canActivate: [SystemAdminGuard]
      },
      {
        path: 'company-config-connection',
        loadChildren:
          () => import('./components/company-config-connection/company-config-connection.module')
          .then(m => m.CompanyConfigConnectionModule),canActivate: [SystemAdminGuard]
      },
      {
        path: 'employee',
        loadChildren:
          () => import('./components/employee/employee.module').then(m => m.EmployeeModule),canActivate: [CompanyManagerGuard]
      },
      {
        path: 'teams',
        loadChildren:
          () => import('./components/team/team.module').then(m => m.TeamModule),canActivate: [CompanyManagerGuard]
      },
      {
        path: 'departments',
        loadChildren:
          () => import('./components/department/department.module').then(m => m.DepartmentModule),canActivate: [CompanyManagerGuard]
      },
      {
        path: '',
        loadChildren:
          () => import('./material-component/material.module').then(m => m.MaterialComponentsModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      }
    ],
    canActivate: [AuthGuard]
  }
];
