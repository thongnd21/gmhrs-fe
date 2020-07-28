import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailEditorComponent } from 'angular-email-editor';
import { EmailApiService } from '../../api-services/email-api.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
    let html =null;
    if(this.name.length < 6 || this.name.length > 50){
      this.checkAdd = false;
    }else{
      console.log(this.emailEditor);
      this.emailEditor.saveDesign((data) =>
        {
          jsonData = data;
          this.emailEditor.exportHtml((data : any) =>
            {
              html = data.html;
              emailObj = {
                accountId:this.accountId,
                name : this.name,
                dataTemplate: JSON.stringify(jsonData),
                html : html
              };
              console.log(emailObj);
              this.emailServices.createEmailTemplate(emailObj).subscribe(
                (res:any)=>{
                  location.reload();
                  this.toast.success(res.message);
                },
                (err)=>{
                  this.toast.error("Services í not available!");
                }
              )
            }
          );
        }
      );
    }
  }

  getAllTemplate(){
    let listTemplate=[];
    this.emailServices.getAllTemplate(this.accountId).subscribe(
      (res)=>{
        const templateList: any = res;
        templateList.forEach(element => {
          let item = {};
          item['templateId'] = element.templateId;
          item['templateName'] = element.templateName;
          item['status'] = element.status;
          item['create_at'] = moment.utc(element.modified_date).local().format('LLLL');
          listTemplate.push(item);
        });
        console.log(templateList);
        this.dataSource = new MatTableDataSource(listTemplate);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err)=>{

      }
    )
  }

  openTemplateDetail(detail,id){
    this.emailServices.getTemplate(id).subscribe(
      (res)=>{
        const templateEmail: any = res;
        console.log(res);
        this.tempate['id'] = id;
        this.tempate['templateName'] = templateEmail.templateName;
        this.tempate['template'] = templateEmail.template;
        this.tempate['status'] = templateEmail.status;
        const update = this.modalService.open(detail, { windowClass: 'my-class', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
        setTimeout(() =>{
          update.componentInstance.emailEditor = EmailEditorComponent;
          this.emailEditor = update.componentInstance.emailEditor;
        } , 4000);
        
        // update.result.then((res)=>{
        //   console.log('aaaaaaaaa');
        //   let emailEditor: EmailEditorComponent;
        //   emailEditor.loadDesign(JSON.parse(this.tempate['template']));
        // })
      },
      (err)=>{
        this.toast.error("Services í not available!");
      }
    )
  }
  closeModal() {
    this.modalService.dismissAll();
  }


  syncTemplate(id){
    this.emailServices.syncEmailTemplate(id).subscribe(
      (res:any)=>{
        this.getAllTemplate();
        this.toast.success(res.message);
      },
      (err)=>{
        this.toast.error("Services í not available!");
      }
    )
  }
}
