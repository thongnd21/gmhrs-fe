import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailApiService } from '../../api-services/email-api.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { EmailEditorComponent } from 'angular-email-editor';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-detail-auto-reply-mail-template',
  templateUrl: './detail-auto-reply-mail-template.component.html',
  styleUrls: ['./detail-auto-reply-mail-template.component.css']
})
export class DetailAutoReplyMailTemplateComponent implements OnInit {
  @ViewChild(EmailEditorComponent)
  emailEditor: EmailEditorComponent;
  loadingFull = false;
  templateId;
  tempate = {};
  name = "";
  subject = "";
  checkAdd = true;
  accountId = localStorage.getItem('id');
  updateTemplateForm: FormGroup;

  constructor(
    private emailServices: EmailApiService,
    private toast: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    // this.templateId = localStorage.getItem('templateId');


    console.log(this.route.snapshot.queryParamMap);
    this.route.queryParams.subscribe(params => {
      this.templateId = params['id'];
    });
    if (this.templateId === undefined) {
      this.router.navigate(['/auto-reply-mail']);
    } else {
      this.openTemplateDetail(this.templateId);

    }
    console.log(this.templateId);

  }


  openTemplateDetail(id) {
    this.loadingFull = true;
    this.updateTemplateForm = new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),
      subject: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),

    });
    this.emailServices.getTemplate(id).subscribe(
      (res) => {
        this.loadingFull = false;
        const templateEmail: any = res;
        console.log(res);
        this.updateTemplateForm = new FormGroup({
          name: new FormControl(templateEmail.templateName, [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),
          subject: new FormControl(templateEmail.subject, [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),

        });
        this.tempate['id'] = id;
        this.tempate['templateName'] = templateEmail.templateName;
        this.tempate['template'] = templateEmail.template;
        this.tempate['status'] = templateEmail.status;
        this.tempate['subject'] = templateEmail.subject;


        // update.result.then((res)=>{
        //   console.log('aaaaaaaaa');

        this.emailEditor.loadDesign(JSON.parse(this.tempate['template']));
        // })
      },
      (err) => {
        this.loadingFull = false;
        this.toast.error("Services is not available!");
      }
    )
  }

  editorLoaded() {
    if (this.emailEditor !== undefined) {
      this.emailEditor.loadDesign(JSON.parse(this.tempate['template']));
    } else {
      setTimeout(() => this.emailEditor.loadDesign(JSON.parse(this.tempate['template'])), 10000);
    }
  }

  closeDetailTemplate() {
    localStorage.removeItem('templateId');
    this.router.navigate(['/auto-reply-mail']);
  }

  updateTemplate() {
    this.loadingFull = true;
    let emailObj;
    let jsonData = null;
    let html = null;
    let name = this.updateTemplateForm.controls['name'].value;
    let subject = this.updateTemplateForm.controls['subject'].value;
    console.log(this.emailEditor);
    this.emailEditor.saveDesign((data) => {
      jsonData = data;
      this.emailEditor.exportHtml((data: any) => {
        html = data.html;
        emailObj = {
          templateId: this.templateId,
          accountId: this.accountId,
          name: name,
          subject: subject,
          dataTemplate: JSON.stringify(jsonData),
          html: html
        };
        console.log(emailObj);
        this.emailServices.updateEmailTemplate(emailObj).subscribe(
          (res: any) => {
            // location.reload();
            this.loadingFull = false;
            console.log(res);
            if (res.status == 200) {
              this.toast.success(res.message);
            } else if (res.status == 400) {
              this.toast.error(res.message)
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



}
