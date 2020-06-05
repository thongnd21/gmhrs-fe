import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company.component';
import { CompanyRoutes } from './company.routing';
import { MatTableModule} from '@angular/material/table';
import { MatPaginatorModule, MatButtonModule, MatButtonToggleModule, MatDialogModule } from '@angular/material';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatDialogModule,
        RouterModule.forChild(CompanyRoutes)
    ],
    declarations: [CompanyComponent]
})
export class CompanyModule { }
