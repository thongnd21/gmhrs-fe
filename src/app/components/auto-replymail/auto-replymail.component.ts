import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailEditorComponent } from 'angular-email-editor';
import { EmailApiService } from '../../api-services/email-api.service';

@Component({
  selector: 'app-auto-replymail',
  templateUrl: './auto-replymail.component.html',
  styleUrls: ['./auto-replymail.component.css']
})
export class AutoReplymailComponent implements OnInit {
  @ViewChild(EmailEditorComponent)
  private emailEditor: EmailEditorComponent;
  constructor(
    private emailServices: EmailApiService,
  ) { }
  editor = localStorage.getItem('html');

  ngOnInit(): void {
    this.editorLoaded();
  }

  editorLoaded() {
    if (this.emailEditor !== undefined) {
      this.emailEditor.loadDesign(JSON.parse(this.editor));
    } else {
      setTimeout(() => this.emailEditor.loadDesign(JSON.parse(this.editor)), 3000);
    }
  }

  editorExport() {
    let emailObj;
    let jsonData = null;
    let html =null;
    this.emailEditor.saveDesign((data) =>
      {
        jsonData = data;
        this.emailEditor.exportHtml((data : any) =>
          {
            html = data.html;
            emailObj = {
              accountId: localStorage.getItem('id '),
              email: JSON.stringify(jsonData),
              html : html
            };
            console.log(emailObj);
            this.emailServices.createEmailTemplate(emailObj).subscribe(
              (res)=>{
                
              },
              (err)=>{

              }
            )
          }
        );
      }
    );
    
    
    
  }

}
