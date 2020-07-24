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
    MatProgressSpinnerModule,
    MatToolbarModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzSpinModule } from 'ng-zorro-antd/spin';

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
        MatToolbarModule,
        ReactiveFormsModule,
        HttpClientModule,
        AngularEditorModule,
        NzTableModule,
        NzButtonModule,
        NzPopconfirmModule,
        NzInputModule,
        NzCheckboxModule,
        NzIconModule,
        NzInputNumberModule,
        NzDropDownModule,
        NzSelectModule,
        NzModalModule,
        NzBadgeModule,
        NzAffixModule,
        NzAlertModule,
        NzToolTipModule,
        NzTagModule,
        NzCollapseModule,
        NzSpinModule,
        RouterModule.forChild(SignatureTemplateRoutes)
    ],
    declarations: [SignatureTemplateComponent]
})
export class SignatureTemplateModule { }
