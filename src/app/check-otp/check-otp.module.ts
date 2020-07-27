import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CheckOtpComponent } from './check-otp.component';
import { CheckOtpRoutes } from './check-otp-routing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatButtonModule, MatButtonToggleModule, MatDialogModule, MatIconModule, MatCardModule, MatRadioModule, MatChipsModule, MatSortModule, MatInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { NzButtonModule } from 'ng-zorro-antd/button'

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatIconModule,
        FormsModule,
        MatCardModule,
        MatRadioModule,
        MatChipsModule,
        MatSortModule,
        MatInputModule,
        ReactiveFormsModule,
        NgOtpInputModule,
        NzButtonModule,
        RouterModule.forChild(CheckOtpRoutes)
    ],
    declarations: [CheckOtpComponent]
})
export class CheckOtpModule { }
