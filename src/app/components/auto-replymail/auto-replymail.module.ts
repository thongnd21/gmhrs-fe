import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AutoReplymailRoutes } from './auto-replymail.routing';
import { AutoReplymailComponent } from './auto-replymail.component';
import { EmailEditorModule } from 'angular-email-editor';
import { MatTableModule, MatPaginatorModule, MatButtonModule, MatButtonToggleModule, MatDialogModule, MatIconModule, MatCardModule, MatRadioModule, MatChipsModule, MatSortModule, MatInputModule, MatSpinner, MatProgressSpinnerModule, MatTabsModule, MatFormFieldModule, MatSelectModule, MatAutocompleteModule, MatCheckbox, MatCheckboxModule } from '@angular/material';
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
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { NgxLoadingModule } from 'ngx-loading';
import { ClipboardModule } from 'ngx-clipboard'

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
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
    MatTabsModule,
    ClipboardModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    EmailEditorModule,
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
    NzMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DragDropModule,
    NgxLoadingModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    RouterModule.forChild(AutoReplymailRoutes)
  ],
  declarations: [AutoReplymailComponent]
})
export class AutoReplymailModule { }
