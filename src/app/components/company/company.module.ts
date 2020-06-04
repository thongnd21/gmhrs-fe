import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company.component';
import { CompanyRoutes } from './company.routing';
import { NgxDatatableModule} from '@swimlane/ngx-datatable'

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        NgxDatatableModule,
        RouterModule.forChild(CompanyRoutes)
    ],
    declarations: [CompanyComponent]
})
export class CompanyModule { }
