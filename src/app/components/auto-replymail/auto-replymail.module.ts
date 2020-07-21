import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AutoReplymailRoutes } from './auto-replymail.routing';
import { AutoReplymailComponent } from './auto-replymail.component';
import { EmailEditorModule } from 'angular-email-editor';

@NgModule({
  imports: [
    CommonModule,
    EmailEditorModule,
    RouterModule.forChild(AutoReplymailRoutes) 
  ],
  declarations: [AutoReplymailComponent]
})
export class AutoReplymailModule { }
