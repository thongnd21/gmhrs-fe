import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule,MatFormFieldModule,MatInputModule} from '@angular/material';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        RouterModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        CdkTableModule,
        FormsModule,
        FlexLayoutModule],
    declarations: [LoginComponent]
}) 
export class LoginModule {}
