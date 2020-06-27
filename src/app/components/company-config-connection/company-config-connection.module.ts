import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompanyConfigConnectionComponent } from './company-config-connection.component';
import { CompanyConfigConnectionRoutes } from './company-config-connection.routing';
import {  MatButtonModule,
     MatButtonToggleModule, MatDialogModule, 
     MatIconModule, MatCardModule, MatInputModule, 
      MatMenuModule, 
      MatTabsModule,
      MatStepperModule,
      MatSelectModule,
      MatOptionModule,
      MatRadioModule,
      MatSlideToggleModule,
      MatProgressSpinnerModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
        RouterModule.forChild(CompanyConfigConnectionRoutes)
    ],
    declarations: [CompanyConfigConnectionComponent]
})
export class CompanyConfigConnectionModule { }
