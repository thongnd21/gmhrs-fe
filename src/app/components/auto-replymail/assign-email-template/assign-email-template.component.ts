import { Component, OnInit, ContentChild, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldControl, MatFormField, MatTableDataSource, MatTable } from '@angular/material';
import { DepartmentApiService } from './../../../api-services/department-api.service';
import { AccountApiService } from './../../../api-services/account-api.service';
import { PositionApiService } from './../../../api-services/position-api.service';
import { TeamApiService } from './../../../api-services/team-api.service';
import { EmailApiService } from './../../../api-services/email-api.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import clonedeep from 'lodash.clonedeep';

@Component({
  selector: 'app-assign-email-template',
  templateUrl: './assign-email-template.component.html',
  styleUrls: ['./assign-email-template.component.css']
})
export class AssignEmailTemplateComponent implements OnInit {
  // @ContentChild(MatFormFieldControl) _control: MatFormFieldControl<any>;
  // @ViewChild(MatFormField) _matFormField: MatFormField;

  displayedColumns = ['type', 'listId', 'templateId', 'action'];
  depList = [];
  positionList = [];
  teamList = [];
  templateList = [];
  asignRuleListBegin = [];
  dataSource: MatTableDataSource<any>;
  data = [];

  accountId = localStorage.getItem('id');



  constructor(
    private modalService: NgbModal,
    private toast: ToastrService,
    private departmentService: DepartmentApiService,
    private accountService: AccountApiService,
    private positionService: PositionApiService,
    private teamService: TeamApiService,
    private emailService: EmailApiService,
  ) {
  }

  ngOnInit(): void {
    this.getAllTemplate();
    this.getAllTemplateRuleByAccountId();

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
              this.toast.error("null")
            } else {
              this.positionList = res;

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
    const priority = this.dataSource.data.length;

    this.dataSource.data.push({ type: '', listId: [], templateId: '', priority: priority + 1 });
    this.dataSource.filter = "";
    console.log(priority);


  }

  removeAt(index: number) {
    console.log("index" + index);

    const data = this.dataSource.data.filter((_, ins) => ins !== index);

    this.dataSource.data = data;
  }


  getAllTemplate() {
    this.emailService.getAllTemplate(this.accountId).subscribe(
      (res: any) => {
        this.templateList = res;
      },
      (err) => {
        console.log(err);

      }
    )
  }

  getAllTemplateRuleByAccountId() {
    this.emailService.getAllTemplateRuleByAccountId(this.accountId).subscribe(
      (res: any) => {

        this.data = res
        this.dataSource = new MatTableDataSource(this.data);
        this.asignRuleListBegin = res;
        console.log(this.asignRuleListBegin);

        console.log(this.data);
      },
      (err) => {
        console.log(err);
        this.toast.error("Server is unavailable!");
      }
    )
  }

  compareListAsignRule(oldList, newList) {
    var listUpdate=[];
    var listDelete=[];
    var listCreate=[];
    for (let i = 0; i < oldList.length; i++) {
      for (let j = 0; j < newList.length; j++) {
        if(true){
          
        }
      }
    }
  }

  dropTable(event) {
    moveItemInArray(this.dataSource.data, event.previousIndex, event.currentIndex);
    this.dataSource.data = clonedeep(this.dataSource.data);
    console.log(this.dataSource.data);
    
    // console.log(event);

  }
}
