import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule, MatRadioModule, MatPaginatorModule, MatSelectModule, MatSortModule, MatTableModule, MatIconModule } from '@angular/material';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatRadioModule,
        MatPaginatorModule,
        MatSelectModule,
        MatSortModule,
        MatTableModule,
        MatIconModule,
        RouterModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        CdkTableModule,
        FormsModule,
        FlexLayoutModule],
    declarations: [LoginComponent]
})
export class LoginModule { }
