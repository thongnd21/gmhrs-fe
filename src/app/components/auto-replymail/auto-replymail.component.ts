import { Component, OnInit } from '@angular/core';
import { EmailEditorComponent } from 'angular-email-editor';

@Component({
  selector: 'app-auto-replymail',
  templateUrl: './auto-replymail.component.html',
  styleUrls: ['./auto-replymail.component.css']
})
export class AutoReplymailComponent implements OnInit {
  private emailEditor: EmailEditorComponent;
  constructor(
    
  ) { }

  ngOnInit(): void {
  }
  editorLoaded( ){
    // this.emailEditor.loadDesign({});
  }

}
