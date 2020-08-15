import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailEditorComponent } from 'angular-email-editor';
import { EmailApiService } from '../../api-services/email-api.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AssignEmailTemplateComponent } from './assign-email-template/assign-email-template.component'
import { Template } from '@angular/compiler/src/render3/r3_ast';
@Component({
  selector: 'app-auto-replymail',
  templateUrl: './auto-replymail.component.html',
  styleUrls: ['./auto-replymail.component.css'],
  template: `<app-assign-email-template #assign></app-assign-email-template>`
})
export class AutoReplymailComponent implements OnInit {
  @ViewChild("assign") assignComponent: AssignEmailTemplateComponent;
  @ViewChild(EmailEditorComponent)
  emailEditor: EmailEditorComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [];
  dataSource: any;
  loadingFull = false;
  tempate = {};
  name = "";
  checkAdd = true;
  constructor(
    private emailServices: EmailApiService,
    private toast: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    public dialog: MatDialog,
  ) { }
  accountId = localStorage.getItem('id');

  column = [
    {
      prop: 'count',
    },
    {
      prop: 'templateName',
      name: 'Template Name'
    },
    {
      prop: 'status',
      name: 'Status'
    },
    {
      prop: 'create_at',
      name: 'Created At'
    },
    {
      prop: 'action',
      name: 'Action'
    }
  ];

  ngOnInit() {
    this.displayedColumns = this.column.map((c) => c.prop);
    this.getAllTemplate();
  }

  editorLoaded() {
    if (this.emailEditor !== undefined) {
      this.emailEditor.loadDesign(JSON.parse(this.tempate['template']));
    } else {
      setTimeout(() => this.emailEditor.loadDesign(JSON.parse(this.tempate['template'])), 10000);
    }
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
              this.toast.error("Services is not available!");
            }
          )
        }
        );
      }
      );
    }
  }

  getAllTemplate() {
    let listTemplate = [];
    this.loadingFull = true
    this.emailServices.getAllTemplate(this.accountId).subscribe(
      (res) => {
        const templateList: any = res;
        templateList.forEach(element => {
          let item = {};
          item['templateId'] = element.templateId;
          item['templateName'] = element.templateName;
          item['status'] = element.status;
          item['create_at'] = moment.utc(element.modified_date).local().format('LLLL');
          listTemplate.push(item);
        });
        this.dataSource = new MatTableDataSource(listTemplate);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loadingFull = false
      },
      (err) => {
        console.log(err);
        this.loadingFull = false
        this.toast.error("Server unavailable!");

      }
    )
    console.log(listTemplate);

  }

  openTemplateDetail(id) {
    console.log(id);

    this.router.navigate(['/detail-auto-reply-mail', { 'id': id }]);
  }
  closeModal() {
    this.modalService.dismissAll();
  }


  syncTemplate(id) {
    this.loadingFull = true
    this.emailServices.syncEmailTemplate(id).subscribe(
      (res: any) => {
        this.getAllTemplate();
        this.loadingFull = false
        this.toast.success(res.message);
      },
      (err) => {
        this.loadingFull = false
        this.toast.error("Services is not available!");
      }
    )
  }

  setDefault(templateId) {
    var data = {};
    console.log(templateId);
    this.loadingFull = true
    data["id"] = templateId;
    data["accountId"] = localStorage.getItem('id');
    this.emailServices.setTemplateDefault(data).subscribe(
      (res: any) => {
        console.log(res);
        this.getAllTemplate();
        this.loadingFull = false
        this.toast.success("Set Default Successfully!")
      },
      (err) => {
        console.log(err);
        this.loadingFull = false
        this.toast.success("Set Default Fail!")
      }
    )
  }

  deleteTemplateId;
  assignTemplateList = [];
  checkTemplateAssigningList = [];
  checkAssign: Boolean;
  openDialogDelete(dialog, templateId) {
    this.checkTemplateAssigningList = [];
    this.deleteTemplateId = templateId;

    this.emailServices.getAllTemplateRuleByAccountId(this.accountId).subscribe(
      (res: any) => {
        console.log(res);

        this.assignTemplateList = res
        console.log(this.assignTemplateList);

        if (this.assignTemplateList != null && this.assignTemplateList.length > 0 && this.assignTemplateList.length != undefined) {
          for (let i = 0; i < this.assignTemplateList.length; i++) {
            if (this.deleteTemplateId == this.assignTemplateList[i].templateId) {
              this.checkTemplateAssigningList.push(this.assignTemplateList[i]);
            }
          }
        }
        if (this.checkTemplateAssigningList != null && this.checkTemplateAssigningList.length > 0 && this.checkTemplateAssigningList.length != undefined) {
          this.checkAssign = true;
        } else { this.checkAssign = false };
        console.log(this.checkAssign);

      },
      (err) => {
        console.log(err);
        this.toast.error("Server is unavailable!");
      }
    )
    this.dialog.open(dialog);
  }

  delete() {
    this.loadingFull = true;
    console.log(this.deleteTemplateId);

    this.emailServices.deleteTemplate(this.deleteTemplateId).subscribe(
      (res: any) => {
        this.loadingFull = false;
        console.log(res);
        this.getAllTemplate();
        this.dialog.closeAll();
      },
      (err) => {
        this.loadingFull = false
        console.log(err);

      }
    )
  }
}
