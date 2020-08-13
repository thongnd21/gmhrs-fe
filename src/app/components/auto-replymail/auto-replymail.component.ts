import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailEditorComponent } from 'angular-email-editor';
import { EmailApiService } from '../../api-services/email-api.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
@Component({
  selector: 'app-auto-replymail',
  templateUrl: './auto-replymail.component.html',
  styleUrls: ['./auto-replymail.component.css']
})
export class AutoReplymailComponent implements OnInit {
  @ViewChild(EmailEditorComponent)
  emailEditor: EmailEditorComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [];
  dataSource: any;
  loading = false;
  tempate = {};
  name = "";
  checkAdd = true;
  constructor(
    private emailServices: EmailApiService,
    private toast: ToastrService,
    private modalService: NgbModal,
    private router: Router,
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
      },
      (err) => {
        console.log(err);
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
    this.emailServices.syncEmailTemplate(id).subscribe(
      (res: any) => {
        this.getAllTemplate();
        this.toast.success(res.message);
      },
      (err) => {
        this.toast.error("Services is not available!");
      }
    )
  }

  setDefault(templateId) {
    var data = {};
    console.log(templateId);

    data["id"] = templateId;
    data["accountId"] = localStorage.getItem('id');
    this.emailServices.setTemplateDefault(data).subscribe(
      (res: any) => {
        console.log(res);
        this.getAllTemplate();
        this.toast.success("Set Default Successfully!")
      },
      (err) => {
        console.log(err);
        this.toast.success("Set Default Fail!")
      }
    )
  }
}
