import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TwoFaAuthComponent } from './two-fa-auth.component';
import { TwoFaAuthRoutes } from './two-fa-auth-routing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatButtonModule, MatButtonToggleModule, MatDialogModule, MatIconModule, MatCardModule, MatRadioModule, MatChipsModule, MatSortModule, MatInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { QRCodeModule } from 'angularx-qrcode';
import { NzButtonModule } from 'ng-zorro-antd/button';

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
        QRCodeModule,
        NzButtonModule,
        RouterModule.forChild(TwoFaAuthRoutes)
    ],
    declarations: [TwoFaAuthComponent]
})
export class TwoFaAuthModule { }
