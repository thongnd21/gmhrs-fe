import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SignatureTemplateComponent } from './signature-template.component';
import { SignatureTemplateRoutes } from './signature-template-routing';
import { MatTableModule } from '@angular/material/table';
import {
    MatTabsModule,
    MatPaginatorModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatIconModule,
    MatCardModule,
    MatRadioModule,
    MatChipsModule,
    MatSortModule,
    MatInputModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NzTableModule } from 'ng-zorro-antd/table';
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
        MatTabsModule,
        MatRadioModule,
        MatChipsModule,
        MatSortModule,
        MatInputModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        HttpClientModule,
        AngularEditorModule,
        NzTableModule,
        NzButtonModule,
        RouterModule.forChild(SignatureTemplateRoutes)
    ],
    declarations: [SignatureTemplateComponent]
})
export class SignatureTemplateModule { }
