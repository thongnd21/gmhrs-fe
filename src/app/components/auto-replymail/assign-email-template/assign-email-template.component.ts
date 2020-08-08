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

    this.dataSource.data.push({ id: '', type: '', listId: [], templateId: '', priority: 0 });
    this.dataSource.filter = "";


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
        this.asignRuleListBegin = res;

        this.data = res
        this.dataSource = new MatTableDataSource(this.data);

      },
      (err) => {
        console.log(err);
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
    //checking update row and add to a new list if id in old list and new list ==
    // for (let i = 0; i < listPriority.length; i++) {
    //   for (let j = 0; j < oldList.length; j++) {
    //     if (listPriority[i].id == oldList[j].id) {
    //       listCheckUpdate.push(listPriority[i]);
    //     }
    //   }
    // }
    // //update if != priority
    // for (let i = 0; i < listCheckUpdate.length; i++) {
    //   for (let j = 0; j < oldList.length; j++) {
    //     if (listCheckUpdate[i].priotiry == oldList[j].priotity && listCheckUpdate[i].id != oldList[j].id) {
    //       listResult.listUpdate.push(listCheckUpdate[i]);
    //     }
    //   }
    // }
    // // checking field update in listCheckUpdate if any field change > add to listResult.listUpdate
    // for (let i = 0; i < listCheckUpdate.length; i++) {
    //   if (oldList[i].type != listCheckUpdate[i].type || oldList[i].templateId != listCheckUpdate[i].templateId) {
    //     listResult.listUpdate.push(listCheckUpdate[i]);
    //   } else {
    //     if (oldList[i].listId.length != listCheckUpdate[i].listId.length) {
    //       listResult.listUpdate.push(listCheckUpdate[i]);
    //     }
    //     for (let j = 0; j < listCheckUpdate[i].listId.length; j++) {
    //       if (oldList[i].listId[j] != listCheckUpdate[i].listId[j]) {
    //         listResult.listUpdate.push(listCheckUpdate[i]);
    //       }
    //     }
    //   }
    // }
    // console.log(newList);

    // var newListExceptupdate = newList;// newList excep update element
    // for (let i = 0; i < listResult.listUpdate.length; i++) {
    //   for (let j = 0; j < newList.length; j++) {
    //     if (listResult.listUpdate[i].priotiry == newList[j].priotity) {
    //       newListExceptupdate.splice(j, 1);
    //     }
    //   }
    // }
    // console.log(listCheckUpdate);
    // console.log(listResult.listUpdate);
    // console.log(newListExceptupdate);



    // for (let i = 0; i < newList.length; i++) {
    //   if (newList[i].id == "" && newList[i].type != "" && newList[i].templateId != "" && newList[i].listId.length != 0) {
    //     listResult.listCreate.push(newList[i]);
    //   }
    // }
    // console.log(listResult);

    // for (let i = 0; i < oldList.length; i++) {
    //   for (let j = 0; j < newList.length; j++) {
    //     if (oldList[i].id == newList[j].id) {
    //       if (oldList[i].type == newList[j].type) {
    //         if (oldList[i].templateId == newList[j].templateId) {

    //         } else {
    //           listResult.listUpdate.push(newList[j]);
    //         }
    //       } else {
    //         listResult.listUpdate.push(newList[j]);
    //       }
    //     } else {
    //       listResult.listUpdate.push(newList[j]);
    //     }
    //   }
    // }
  }

  dropTable(event) {
    moveItemInArray(this.dataSource.data, event.previousIndex, event.currentIndex);
    this.dataSource.data = JSON.parse(JSON.stringify(this.dataSource.data))

    // console.log(event);

  }

  saveTemplateRule() {
    var send = {
    }
    var result = this.formatListTemplateRuleByPriority(this.dataSource.data);
    send["accountId"] = this.accountId;
    send["listCreate"] = result;
    this.emailService.saveAssignTemplate(send).subscribe(
      (res: any) => {
        if(res.code ===200){
          this.toast.success("Save successfully");
        }else{
          this.toast.error("Save fail");
        }

      },
      (err) => {
        console.log(err);
        this.toast.error("Server unavailable!")
      }
    )


  }

  synch(){
    this.emailService.syncDateForTemplate(this.accountId).subscribe(
      (res)=>{
        console.log(res);
        
      },
      (err)=>{
        console.log(err);
        
      }
    )
  }
}
