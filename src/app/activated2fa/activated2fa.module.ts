import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Activated2faComponent } from './activated2fa.component';
import { Activated2faRoutes } from './activated2fa-routing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatButtonModule, MatButtonToggleModule, MatDialogModule, MatIconModule, MatCardModule, MatRadioModule, MatChipsModule, MatSortModule, MatInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';

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
        RouterModule.forChild(Activated2faRoutes)
    ],
    declarations: [Activated2faComponent]
})
export class Activated2faModule { }
