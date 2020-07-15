import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailEditorComponent } from 'angular-email-editor';

@Component({
  selector: 'app-auto-replymail',
  templateUrl: './auto-replymail.component.html',
  styleUrls: ['./auto-replymail.component.css']
})
export class AutoReplymailComponent implements OnInit {
  @ViewChild(EmailEditorComponent)
  private emailEditor: EmailEditorComponent;
  constructor(
    
  ) { }
  editor = localStorage.getItem('html');

  ngOnInit(): void {
    this.editorLoaded();
  }

  editorLoaded() {
    if (this.emailEditor !== undefined) {
      this.emailEditor.loadDesign (JSON.parse(this.editor));
    } else {
      setTimeout (() => this.emailEditor.loadDesign (JSON.parse(this.editor)), 3000);
    }
  }

  editorExport( ){
    this.emailEditor.saveDesign((data) => 
      console.log(data),
      // localStorage.setItem('html',JSON.stringify(data))
    );
    this.emailEditor.exportHtml((html) => 
      console.log(html)
    );
  }

}
