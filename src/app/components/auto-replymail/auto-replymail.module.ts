import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AutoReplymailRoutes } from './auto-replymail.routing';
import { AutoReplymailComponent } from './auto-replymail.component';
import { EmailEditorModule } from 'angular-email-editor';
import { MatTableModule, MatPaginatorModule, MatButtonModule, MatButtonToggleModule, MatDialogModule, MatIconModule, MatCardModule, MatRadioModule, MatChipsModule, MatSortModule, MatInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    MatInputModule,
    ReactiveFormsModule,
    EmailEditorModule,
    RouterModule.forChild(AutoReplymailRoutes)
  ],
  declarations: [AutoReplymailComponent]
})
export class AutoReplymailModule { }
