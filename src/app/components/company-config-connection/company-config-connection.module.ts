import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompanyConfigConnectionComponent } from './company-config-connection.component';
import { CompanyConfigConnectionRoutes } from './company-config-connection.routing';
import {
    MatButtonModule,
    MatButtonToggleModule, MatDialogModule,
    MatIconModule, MatCardModule, MatInputModule,
    MatMenuModule,
    MatTabsModule,
    MatStepperModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    MatSlideToggleModule,

    MatProgressSpinnerModule,
    MatExpansionModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { NgxLoadingModule } from 'ngx-loading';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatStepperModule,
        MatRadioModule,
        MatSelectModule,
        MatOptionModule,
        MatIconModule,
        FormsModule,
        MatSlideToggleModule,
        MatCardModule,
        MatInputModule,
        MatStepperModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        FormsModule,
        MatMenuModule,
        MatTabsModule,
        MatDialogModule,
        NgxJsonViewerModule,
        MaterialFileInputModule,
        NgxLoadingModule,
        NzSpinModule,
        MatChipsModule,
        MatExpansionModule,
        RouterModule.forChild(CompanyConfigConnectionRoutes)
    ],
    declarations: [CompanyConfigConnectionComponent]
})
export class CompanyConfigConnectionModule { }
