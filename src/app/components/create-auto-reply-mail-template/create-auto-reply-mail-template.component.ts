import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailEditorComponent } from 'angular-email-editor';
import { EmailApiService } from '../../api-services/email-api.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-auto-reply-mail-template',
  templateUrl: './create-auto-reply-mail-template.component.html',
  styleUrls: ['./create-auto-reply-mail-template.component.css']
})
export class CreateAutoReplyMailTemplateComponent implements OnInit {
  @ViewChild(EmailEditorComponent)
  emailEditor: EmailEditorComponent;


  loadingFull = false;
  name = "";
  checkAdd = true;
  accountId = localStorage.getItem('id');
  tempate = {};
  subject = "";
  templateForm: FormGroup;
  constructor(
    private router: Router,
    private emailServices: EmailApiService,
    private toast: ToastrService,
    private modalService: NgbModal,
  ) { }


  ngOnInit(

  ): void {
    this.createTemplateForm();

  ngOnInit(): void {
  }
  goToAssignEmail() {
    this.router.navigate(['/auto-reply-mail'])

  editorExport() {
    this.loadingFull = true;
    let emailObj;
    let jsonData = null;
    let html = null;

    let name = this.templateForm.controls['name'].value;
    let subject = this.templateForm.controls['subject'].value;
    console.log(this.emailEditor);
    this.emailEditor.saveDesign((data) => {
      jsonData = data;
      this.emailEditor.exportHtml((data: any) => {
        html = data.html;
        emailObj = {
          accountId: this.accountId,
          name: name,
          subject: subject,
          dataTemplate: JSON.stringify(jsonData),
          html: html
        };
        console.log(emailObj);
        this.emailServices.createEmailTemplate(emailObj).subscribe(
          (res: any) => {
            // location.reload();
            this.loadingFull = false;
            console.log(res);
            if (res.status == 200) {
              this.toast.success("Create Template Successfully !")
//               this.router.navigate(['/auto-reply-mail']);
            } else if (res.status == 400) {
              this.toast.error("Template with this subject existed ! Please input another again !")
            }

          },
          (err) => {
            this.loadingFull = false;
            this.toast.error("Services is not available!");
          }
        )
      }
      );
    }
    );

  }

  createTemplateForm() {
    this.templateForm = new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),
      subject: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),

    });
  }

}
