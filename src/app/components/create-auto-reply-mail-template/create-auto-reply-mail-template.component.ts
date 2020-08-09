import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailEditorComponent } from 'angular-email-editor';
import { EmailApiService } from '../../api-services/email-api.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-auto-reply-mail-template',
  templateUrl: './create-auto-reply-mail-template.component.html',
  styleUrls: ['./create-auto-reply-mail-template.component.css']
})
export class CreateAutoReplyMailTemplateComponent implements OnInit {
  @ViewChild(EmailEditorComponent)
  emailEditor: EmailEditorComponent;


  loading = false;
  name = "";
  checkAdd = true;
  accountId = localStorage.getItem('id');
  tempate = {};
  subject = "";
  constructor(
    private router: Router,
    private emailServices: EmailApiService,
    private toast: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(

  ): void {
  }

  editorExport() {
    let emailObj;
    let jsonData = null;
    let html = null;
    if (this.name.length < 6 || this.name.length > 50) {
      this.checkAdd = false;
    } else if (this.subject.length < 6 || this.subject.length > 50) {
      this.checkAdd = false;
    } else {
      console.log(this.emailEditor);
      this.emailEditor.saveDesign((data) => {
        jsonData = data;
        this.emailEditor.exportHtml((data: any) => {
          html = data.html;
          emailObj = {
            accountId: this.accountId,
            name: this.name,
            subject : this.subject,
            dataTemplate: JSON.stringify(jsonData),
            html: html
          };
          console.log(emailObj);
          this.emailServices.createEmailTemplate(emailObj).subscribe(
            (res: any) => {
              // location.reload();
              this.toast.success(res.message);
              this.router.navigate(['/auto-reply-mail']);
            },
            (err) => {
              this.toast.error("Services is not available!");
            }
          )
        }
        );
      }
      );
    }
  }

}
