import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {SelectionModel} from '@angular/cdk/collections';
import { AccountApiService } from '../../api-services/account-api.service';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DepartmentApiService } from '../../api-services/department-api.service';
import { TeamApiService } from '../../api-services/team-api.service';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  displayedColumns: string[] = [];
  dataSource: any;
  empForm: FormGroup;
  grpForm;
  selection = new SelectionModel<any>(true, []);
  teamId;
  insEmp ={};
  departmentList = [];
  listEmployee = [];
  column = [
    {
      prop: 'select'
    },
    {
      prop: 'primary_email',
      name: 'primary_email'
    },
    {
      prop: 'personal_email',
      name: 'personal_email'
    },
    {
      prop: 'name',
      name: 'name'
    },
    {
      prop: 'phone',
      name: 'phone'
    },
    {
      prop: 'depName',
      name: 'depName'
    },
    {
      prop: 'created_date',
      name: 'CreateAt'
    },
    {
      prop: 'action'
    }
  ];
  listTeam =[];

  constructor(
    private modalService: NgbModal,
    private accountServices : AccountApiService,
    private depServices: DepartmentApiService,
    private router: Router,
    private toast : ToastrService,
    private teamService :TeamApiService
    ) { }

  ngOnInit() {
    this.displayedColumns = this.column.map((c) => c.prop)
    this.getAllAccount();
    // this.getDepartment(); 
  }

  getAllAccount() {
    const listAccount = [];
    this.accountServices.getAllEmployee().subscribe(
      (res)=>{
        const accounts : any = res;
        if(accounts != null){
          accounts.forEach(element => {
            let item = {};
            item['id'] = element.id;
            item['primary_email'] = element.primary_email;
            item['personal_email'] = element.personal_email;
            item['phone'] = element.phone;
            item['name'] = element.first_name +" "+ element.last_name;
            item['status'] = element.status_id;
            item['is_sync'] = element.is_sync;
            item['departmentName'] = element.department.name;
            item['created_date'] = moment.utc(element.created_date).local().format('LLLL');
            item['modified_date'] = moment.utc(element.modified_date).local().format('LLLL');
            listAccount.push(item);
          });
          console.log(listAccount);
          this.dataSource = new MatTableDataSource(listAccount);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      (error)=>{
        if(error.status == 0){
          this.toast.error("Connection timeout!");
        }if(error.status == 400){
          this.toast.error("Server is not available!");
        }
          this.toast.error("Server is not available!");
      }
    );
  }


  open(modal) {
      this.empForm = new FormGroup({
        firstname: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30)
        ]),
        lastname: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30)
        ]),
        primary_email: new FormControl("", [Validators.required, Validators.email]),
        personal_email: new FormControl("", [Validators.required, Validators.email]),
        phone: new FormControl("", [
          Validators.required,
          Validators.pattern(new RegExp(/((09|03|07|08|05)+([0-9]{8})\b)/g))
        ]),
        address: new FormControl("", [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50)
        ]),
        // departmentId: new FormControl("")
      });
      this.empForm.setValue({
        firstname : '',
        lastname : '',
        primary_email : '',
        personal_email : '',
        phone:'',
        address:'',
        // departmentId : this.departmentList[0].id
      });
    this.modalService.open(modal, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
  }

  openModalGroup(group){
    console.log(this.selection);
    this.getTeam();
    this.modalService.open(group, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
  }
 
  closeModal() {
    this.modalService.dismissAll();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  viewDetail(item) {
    console.log(item)
    this.router.navigate(['/employee/', item]);
  }

  createEmployee(){
    const employee = {
      primary_email: this.empForm.controls['primary_email'].value,
      personal_email: this.empForm.controls['personal_email'].value,
      phone: this.empForm.controls['phone'].value,
      first_name: this.empForm.controls['firstname'].value,
      last_name: this.empForm.controls['lastname'].value,
      address: this.empForm.controls['address'].value,
      department_id: this.empForm.controls['departmentId'].value,
    }
    this.accountServices.createAccount(employee).subscribe(
      (res)=>{
        this.toast.success("Create Employee success!");
        this.getAllAccount();
        this.closeModal();
      },
      (error)=>{
        this.toast.error("Server is not available!");
        this.closeModal();
      }
    );
  }

  // getDepartment(){
  //   this.departmentList = [];
  //   this.depServices.getAllDepartment().subscribe(
  //     (res) => {
  //       const department: any = res;
  //       department.forEach(element => {
  //         let item = {};
  //         item['id'] = element.id;
  //         item['name'] = element.name;
  //         item['description'] = element.description;
  //         item['created_date'] = moment.utc(element.created_date).local().format('LLLL');
  //         item['modified_date'] = moment.utc(element.modified_date).local().format('LLLL');
  //         this.departmentList.push(item);
  //       });
  //     },
  //     (error) => {
  //       this.toast.error('Server is not avaiable!');
  //     }
  //   );
  // }

  getTeam() {
    this.listTeam = [];
    this.teamService.getAllTeam().subscribe(
      (res)=>{
        const data:any = res;
        data.forEach(element => {
          let item ={};
          item['id'] = element.id;
          item['name'] = element.name;
          item['email'] = element.email;
          item['description'] = element.description;
          item['created_date'] = moment.utc(element.created_date).local().format('LLLL');
          item['modified_date'] = moment.utc(element.modified_date).local().format('LLLL');
          this.listTeam.push(item);
        });
        this.teamId = this.listTeam[0].id;
      },
      (error)=>{
        this.toast.error("Server is not avaiable!");
      }
    );
  }

  addEmpToGroup(){
    let listEmployee=[];
    this.selection.selected.forEach(element => {
      let item ={};
      item['employeeId'] = element.id;
      listEmployee.push(item);
    });
    const employeeTeam = {
      teamId: this.teamId,
      listEmployee: listEmployee
    }
    console.log(employeeTeam);
    this.accountServices.addAccountToTeam(employeeTeam).subscribe(
      (res)=>{
        this.toast.success("Create Employee success!");
        this.getAllAccount();
        this.closeModal();
        this.selection.clear();
      },
      (error)=>{
        this.toast.error("Server is not available!");
        this.closeModal();
      }
    );
  }

}
