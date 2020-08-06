import { Component, OnInit, ContentChild, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldControl, MatFormField, MatTableDataSource } from '@angular/material';
import { DepartmentApiService } from './../../../api-services/department-api.service';
import { AccountApiService } from './../../../api-services/account-api.service';

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
  empList = [];
  dataSource: MatTableDataSource<any>;
  data = [{ type: 'department', listId: [154, 155], priority: 1, templateId: 6, },
  { type: 'employee', listId: [197], priority: 2, templateId: 6, },
  ]

  accountId = localStorage.getItem('id');



  constructor(
    private modalService: NgbModal,
    private toast: ToastrService,
    private departmentService: DepartmentApiService,
    private accountService: AccountApiService,
  ) {
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngOnInit(): void {

  }

  openAssignTemplateMailModal(modal) {
    this.modalService.open(modal, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
  }

  fieldChang(event) {
    if (event.isUserInput) {
      console.log(event.source.value, event.source.selected);
      if (event.source.value == "department" && event.source.selected == true) {
        this.departmentService.getAllDepartmentByAccountId(this.accountId).subscribe(
          (res: any) => {
            this.depList = res;
            console.log(this.depList);
          },
          (err: any) => {
            console.log(err);
            this.toast.error(err);

          }
        )
      };
      if (event.source.value == "employee" && event.source.selected == true) {
        this.accountService.getAllEmployeeByAccountId(this.accountId).subscribe(
          (res: any) => {
            // for(let i =0; i<res.length ; i++){
            //   var dep = {} ;
            //   dep["id"] = res[i].id;
            //   dep["name"]=res[i].name;
            // this.depList.push(dep);
            // }
            this.empList = res;
            console.log(this.empList);
          },
          (err: any) => {
            console.log(err);
            this.toast.error(err);

          }
        )
      };
      if (event.source.value == "team" && event.source.selected == true) {
      }
    }
  }

  addRow() {
    this.dataSource.data.push({ department: '1', template_default: '1', template_assign_role: '1', });
    this.dataSource.filter = "";
    console.log(this.dataSource.data);

  }

  removeAt(index: number) {
    console.log("index" + index);

    const data = this.dataSource.data.filter((_, ins) => ins !== index);
    console.log(data);

    this.dataSource.data = data;
  }

}
