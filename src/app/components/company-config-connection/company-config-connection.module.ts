import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyConfigConnectionComponent } from './company-config-connection.component';
import { CompanyConfigConnectionRoutes } from './company-config-connection.routing';
import {  MatButtonModule,
     MatButtonToggleModule, MatDialogModule, 
     MatIconModule, MatCardModule, MatInputModule, 
      MatMenuModule, 
      MatTabsModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        RouterModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatIconModule,
        FormsModule,
        MatCardModule,
        MatInputModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatTabsModule,
        RouterModule.forChild(CompanyConfigConnectionRoutes)
    ],
    declarations: [CompanyConfigConnectionComponent]
})
export class CompanyConfigConnectionModule { }
