import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { CompanyManagerGuard } from './shared/guard/company-manager.gruad';
import { SystemAdminGuard } from './shared/guard/system-admin.gruad';
import { CheckOTPGuard } from './shared/guard/checkotp.guard';
import { LoginPageGuard } from './shared/guard/loginpage.guard';

export const AppRoutes: Routes = [
  {
    path: 'resetPassword', loadChildren: () => import('./reset-password/reset-password.module')
      .then(m => m.ResetPasswordModule)
  },
  {
    path: '', loadChildren: () => import('./login/login.module')
      .then(m => m.LoginModule), canActivate: [LoginPageGuard]
  },

  {
    path: 'checkotp',
    loadChildren:
      () => import('./check-otp/check-otp.module').then(m => m.CheckOtpModule), canActivate: [CheckOTPGuard]
  },
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
        path: 'twofaauth',
        loadChildren:
          () => import('./two-fa-auth/two-fa-auth.module').then(m => m.TwoFaAuthModule)
      },
      {
        path: 'signaturetemplate',
        loadChildren:
          () => import('./signature-template/signature-template.module').then(m => m.SignatureTemplateModule)
      },
      {
        path: 'activated2fa',
        loadChildren:
          () => import('./activated2fa/activated2fa.module').then(m => m.Activated2faModule)
      },
      {
        path: 'company',
        loadChildren:
          () => import('./components/company/company.module').then(m => m.CompanyModule), canActivate: [SystemAdminGuard]
      },
      {
        path: 'company-config-connection',
        loadChildren:
          () => import('./components/company-config-connection/company-config-connection.module')
            .then(m => m.CompanyConfigConnectionModule), canActivate: [CompanyManagerGuard]
      },
      {
        path: 'employee',
        loadChildren:
          () => import('./components/employee/employee.module').then(m => m.EmployeeModule), canActivate: [CompanyManagerGuard]
      },
      {
        path: 'teams',
        loadChildren:
          () => import('./components/team/team.module').then(m => m.TeamModule), canActivate: [CompanyManagerGuard]
      },
      {
        path: 'departments',
        loadChildren:
          () => import('./components/department/department.module').then(m => m.DepartmentModule), canActivate: [CompanyManagerGuard]
      },
      {
        path: 'auto-reply-mail',
        loadChildren:
          () => import('./components/auto-replymail/auto-replymail.module').then(m => m.AutoReplymailModule), canActivate: [CompanyManagerGuard]
      },
      {
        path: '',
        loadChildren:
          () => import('./material-component/material.module').then(m => m.MaterialComponentsModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'guidles',
        loadChildren: () => import('./components/guides/guidles.module').then(m => m.GuidlesModule)
      }, {
        path: 'create-auto-reply-mail',
        loadChildren:
          () => import('./components/create-auto-reply-mail-template/create-auto-reply-mail-template.component.module').then(m => m.CreateAutoReplyMailTemplateModule), canActivate: [CompanyManagerGuard]
      },
      {
        path: 'detail-auto-reply-mail',
        loadChildren:
          () => import('./components/detail-auto-reply-mail-template/detail-auto-reply-mail-template.component.module').then(m => m.DetailAutoReplyMailTemplateModule), canActivate: [CompanyManagerGuard]
      },
    ],
    canActivate: [AuthGuard]
  }
];
