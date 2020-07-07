
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SystemAdminGuard } from './shared/guard/system-admin.gruad';
import { CompanyManagerGuard } from './shared/guard/company-manager.gruad';
import { CheckOTPGuard } from './shared/guard/checkotp.guard';
import { LoginPageGuard } from './shared/guard/loginpage.guard';


@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    AppHeaderComponent,
    SpinnerComponent,
    AppSidebarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    SharedModule,
    NgbModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(AppRoutes)
  ],
  providers: [
    AuthGuard,
    SystemAdminGuard,
    CompanyManagerGuard,
    CheckOTPGuard,
    LoginPageGuard,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
