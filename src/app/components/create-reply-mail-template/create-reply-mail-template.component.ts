import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailEditorComponent } from 'angular-email-editor';
import { EmailApiService } from '../../api-services/email-api.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-reply-mail-template',
  templateUrl: './create-reply-mail-template.component.html',
  styleUrls: ['./create-reply-mail-template.component.css']
})
export class CreateReplyMailTemplateComponent implements OnInit {
  @ViewChild(EmailEditorComponent)
  emailEditor: EmailEditorComponent;


  loading = false;
  name = "";
  checkAdd = true;
  accountId = localStorage.getItem('id');
  tempate = {};

  constructor(
    private emailServices: EmailApiService,
    private toast: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }


  editorExport() {
    let emailObj;
    let jsonData = null;
    let html = null;
    if (this.name.length < 6 || this.name.length > 50) {
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
            dataTemplate: JSON.stringify(jsonData),
            html: html
          };
          console.log(emailObj);
          this.emailServices.createEmailTemplate(emailObj).subscribe(
            (res: any) => {
              location.reload();
              this.toast.success(res.message);
            },
            (err) => {
              this.toast.error("Services í not available!");
            }
          )
        }
        );
      }
      );
    }
  }

}
