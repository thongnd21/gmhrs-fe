import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailEditorComponent } from 'angular-email-editor';
import { EmailApiService } from '../../api-services/email-api.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { DepartmentApiService } from '../../api-services/department-api.service';
import { AccountApiService } from '../../api-services/account-api.service';
import { PositionApiService } from '../../api-services/position-api.service';
import { TeamApiService } from '../../api-services/team-api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-auto-replymail',
  templateUrl: './auto-replymail.component.html',
  styleUrls: ['./auto-replymail.component.css'],
  template: `<app-assign-email-template #assign></app-assign-email-template>`
})
export class AutoReplymailComponent implements OnInit {
  @ViewChild(EmailEditorComponent)
  emailEditor: EmailEditorComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [];
  displayedColumnsRule = ['type', 'listId', 'templateId', 'action'];
  dataSource: any;
  dataSourceRule: MatTableDataSource<any>;;
  loadingFull = false;
  checkAdd = true;
  data = [];
  employeeList = []
  templateList = [];
  depList = [];
  teamList = [];
  positionList = [];
  constructor(
    private emailServices: EmailApiService,
    private toast: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    public dialog: MatDialog,
    private departmentService: DepartmentApiService,
    private accountService: AccountApiService,
    private positionService: PositionApiService,
    private teamService: TeamApiService,
    private emailService: EmailApiService,
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
    console.log('manage page');
    this.getAllTemplate();
    this.getAllTemplateRuleByAccountId();
    this.createTemplateForm();
  }

  editorLoaded() {
    if (this.emailEditor !== undefined) {
      this.emailEditor.loadDesign(JSON.parse(this.tempate['template']));
    } else {
      setTimeout(() => this.emailEditor.loadDesign(JSON.parse(this.tempate['template'])), 10000);
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
        this.templateList = listTemplate;
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

    this.router.navigate(['/detail-auto-reply-mail'], { queryParams: { 'id': id, skipLocationChange: true } });
  }
  closeModal() {
    this.modalService.dismissAll();
  }


  syncTemplate(id) {
    this.loadingFull = true
    let checkDefault = false;
    for (let i = 0; i < this.templateList.length; i++) {
      if (this.templateList[i].status === true) {
        checkDefault = true;
      }
    }
    console.log(checkDefault);

    if (checkDefault == true) {
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
    } else {
      this.loadingFull = false;
      this.toast.warning("Please set template default before apply!");
    }

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
        this.toast.success("Template is deleted!");
        this.getAllTemplate();
        this.dialog.closeAll();
      },
      (err) => {
        this.loadingFull = false
        console.log(err);

      }
    )
  }

  openAssignTemplateMailModal(modal) {
    this.modalService.open(modal, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
  }

  fieldChang(event) {
    if (event.isUserInput) {
      console.log(event.source.value, event.source.selected);
      if (event.source.value == "D" && event.source.selected == true) {
        this.departmentService.getAllDepartmentByAccountId(this.accountId).subscribe(
          (res: any) => {
            this.depList = res;
            this.getAllTemplate();
          },
          (err: any) => {
            console.log(err);
            this.toast.error(err);

          }
        )
      };
      if (event.source.value == "P" && event.source.selected == true) {
        this.positionService.getAllPositionByAccountId(this.accountId).subscribe(
          (res: any) => {
            console.log(res);

            if (res.length < 1) {
              this.toast.error("There are no any position")
            } else {
              this.positionList = res;
              this.getAllTemplate();

            }
          },
          (err: any) => {
            console.log(err);
            this.toast.error(err);

          }
        )
      };
      if (event.source.value == "T" && event.source.selected == true) {
        this.teamService.getAllTeamByAccountId(this.accountId).subscribe(
          (res: any) => {
            // for(let i =0; i<res.length ; i++){
            //   var dep = {} ;
            //   dep["id"] = res[i].id;
            //   dep["name"]=res[i].name;
            // this.depList.push(dep);
            // }
            this.teamList = res;
            this.getAllTemplate();
          },
          (err: any) => {
            console.log(err);
            this.toast.error(err);

          }
        )
      } if (event.source.value == "E" && event.source.selected == true) {
        this.accountService.getAllEmployeeByAccountId(this.accountId).subscribe(
          (res: any) => {


            this.employeeList = res;
            console.log(this.employeeList);
          },
          (err: any) => {
            console.log(err);
            this.toast.error(err);

          }
        )
      }
    }
  }

  addRow() {
    const priority = this.dataSourceRule.data.length;

    this.dataSourceRule.data.push({ id: '', type: '', listId: [], templateId: '', priority: 0 });
    this.dataSourceRule.filter = "";


  }

  removeAt(index: number) {
    console.log("index" + index);

    const data = this.dataSourceRule.data.filter((_, ins) => ins !== index);

    this.dataSourceRule.data = data;
  }




  getAllTemplateRuleByAccountId() {
    this.loadingFull = true;
    this.emailServices.getAllTemplateRuleByAccountId(this.accountId).subscribe(
      (res: any) => {
        // this.asignRuleListBegin = res;

        this.data = res
        this.dataSourceRule = new MatTableDataSource(this.data);
        console.log(res);
        this.loadingFull = false;
      },
      (err) => {
        console.log(err);
        this.loadingFull = false;
        this.toast.error("Server is unavailable!");
      }
    )
  }

  formatListTemplateRuleByPriority(newList) {

    var listResult = {
      listUpdate: [],
      listDelete: [],
      listCreate: []
    }
    var listPriority = []
    var listCheckUpdate = []

    // except row that not full information
    for (let i = 0; i < newList.length; i++) {
      if (newList[i].type != "" && newList[i].templateId != "" && newList[i].listId.length != 0) {
        newList[i].priority = i + 1;
        listPriority.push(newList[i])
      } else {
        console.log(newList[i]);

      }

    }
    return listPriority;
  }

  dropTable(event) {
    moveItemInArray(this.dataSourceRule.data, event.previousIndex, event.currentIndex);
    this.dataSourceRule.data = JSON.parse(JSON.stringify(this.dataSourceRule.data))

    // console.log(event);

  }

  saveTemplateRule() {
    var send = {
    }
    var result = this.formatListTemplateRuleByPriority(this.dataSourceRule.data);
    send["accountId"] = this.accountId;
    send["listCreate"] = result;
    console.log(result);
    // console.log(this.asignRuleListBegin);

    this.emailServices.saveAssignTemplate(send).subscribe(
      (res: any) => {

        console.log(res);

        if (res.code === 200) {
          this.toast.success("Save successfully");
        } else if (res.code === 500) {
          this.toast.error("Save fail!");
        } else if (res.code === 400) {
          this.toast.error("Miss Field!")
        }
        this.dialog.closeAll();
      },
      (err) => {
        console.log(err);
        this.toast.error("Server unavailable!")
      }
    )


  }

  synch() {
    this.dialog.closeAll();
    this.loadingFull = true;
    let checkDefault = false;
    for (let i = 0; i < this.templateList.length; i++) {
      if (this.templateList[i].status === true) {
        checkDefault = true;
      }
    }
    console.log(checkDefault);
    if (checkDefault === true) {
      this.emailServices.syncDateForTemplate(this.accountId).subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.toast.success("Apply Template Successfully!");
            this.loadingFull = false;
          } else {
            this.loadingFull = false;
            this.toast.error("Aplly Template Fail!");
          }

        },
        (err) => {
          this.loadingFull = false;
          console.log(err);
          this.toast.error("Server unavailable");

        }
      )
    } else {
      this.loadingFull = false;
      this.toast.warning("Please Set template default before apply!")
    }

  }

  detailResponse = new Array();
  opentDetail(modal, data) {
    this.loadingFull = true;
    console.log(data);
    this.detailResponse = new Array();
    this.emailServices.getEmailTemplateRuleDetailBySpecificTemplateId(data).subscribe(
      (res: any) => {
        this.loadingFull = false;
        console.log(res);
        if (res != null) {
          if (res.length != undefined && res.length > 0) {
            for (let i = 0; i < res.length; i++) {
              var element = {};
              element["fullName"] = res[i].first_name + " " + res[i].last_name;
              element["primary_email"] = res[i].primary_email;
              this.detailResponse.push(element);
            }
            this.modalService.open(modal, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
          } else {
            this.modalService.open(modal, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
          }
        } else {
          this.toast.warning("Please chooses information!");
        }

      },
      (err) => {
        this.loadingFull = false;
        console.log(err);
        this.toast.error("Server unavailable!")
      }
    )

  }
  openDialogSave(dialog) {
    this.dialog.open(dialog);
  }

  opendialogApply(dialogApply) {
    this.dialog.open(dialogApply);
  }
  checkCreate = false;
  openCreate(createTemplate) {
    this.checkCreate = true;
  }

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
      }
      );
    }
    );
    setTimeout(() => {
      this.emailServices.createEmailTemplate(emailObj).subscribe(
        (res: any) => {
          // location.reload();
          if (res.status == 200) {
            this.getAllTemplate();
            this.templateForm.reset();
            this.checkCreate = false;

          } else if (res.status == 400) {
            console.log(res.status);
            this.toast.error("Template with this subject existed ! Please input another again !");
          }
          this.loadingFull = false;
        },
        (err) => {
          this.loadingFull = false;
          this.toast.error("Services is not available!");
        }
      )
    }, 5000)

  }

  name = "";

  tempate = {};
  subject = "";
  templateForm: FormGroup;
  createTemplateForm() {
    this.templateForm = new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),
      subject: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),

    });
  }

  goToAssignEmail() {
    this.checkCreate = false;
  }
}
