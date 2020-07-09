import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';
import { ResetPasswordRouter } from './reset-password-routing.module';
import { ResetPasswordComponent } from './reset-password.component';
import { RouterModule } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        RouterModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        CdkTableModule,
        FormsModule,
        FlexLayoutModule,
        RouterModule.forChild(ResetPasswordRouter)
    ],
    declarations: [ResetPasswordComponent]
})
export class ResetPasswordModule { }
