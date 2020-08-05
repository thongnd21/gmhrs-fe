import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailApiService } from '../../api-services/email-api.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { EmailEditorComponent } from 'angular-email-editor';

@Component({
  selector: 'app-detail-auto-reply-mail-template',
  templateUrl: './detail-auto-reply-mail-template.component.html',
  styleUrls: ['./detail-auto-reply-mail-template.component.css']
})
export class DetailAutoReplyMailTemplateComponent implements OnInit {
  @ViewChild(EmailEditorComponent)
  emailEditor: EmailEditorComponent;
  loading = false;
  templateId;
  tempate = {};
  name = "";
  checkAdd = true;
  accountId = localStorage.getItem('id');

  constructor(
    private emailServices: EmailApiService,
    private toast: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.templateId = param['id'];
    })
    console.log(this.templateId);

    this.openTemplateDetail(this.templateId);
  }


  openTemplateDetail(id) {
    this.emailServices.getTemplate(id).subscribe(
      (res) => {
        const templateEmail: any = res;
        console.log(res);
        this.tempate['id'] = id;
        this.tempate['templateName'] = templateEmail.templateName;
        this.tempate['template'] = templateEmail.template;
        this.tempate['status'] = templateEmail.status;


        // update.result.then((res)=>{
        //   console.log('aaaaaaaaa');
        console.log(this.tempate['template']);
        
        this.emailEditor.loadDesign(JSON.parse(this.tempate['template']));
        // })
      },
      (err) => {
        this.toast.error("Services í not available!");
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

  closeDetailTemplate(){
    this.router.navigate(['/auto-reply-mail']);
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
