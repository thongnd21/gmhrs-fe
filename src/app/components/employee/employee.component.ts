import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SelectionModel } from '@angular/cdk/collections';
import { AccountApiService } from '../../api-services/account-api.service';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DepartmentApiService } from '../../api-services/department-api.service';
import { TeamApiService } from '../../api-services/team-api.service';
import { MatDialog } from '@angular/material/dialog';
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
  insEmp = {};
  departmentList = [];
  listEmployee = [];
  listAccount = [];
  isSpinning = false;
  column = [
    {
      prop: 'count'
    },
    {
      prop: 'primary_email',
      name: 'primary_email'
    },
    // {
    //   prop: 'personal_email',
    //   name: 'personal_email'
    // },
    {
      prop: 'name',
      name: 'name'
    },
    {
      prop: 'phone',
      name: 'phone'
    },
    {
      prop: 'position_name',
      name: 'Position name'
    },
    {
      prop: 'action',
      name: 'View details'
    }
  ];
  listTeam = [];
  employeeInfo: any;

  constructor(
    private modalService: NgbModal,
    private accountServices: AccountApiService,
    private depServices: DepartmentApiService,
    private router: Router,
    private toast: ToastrService,
    private teamService: TeamApiService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.displayedColumns = this.column.map((c) => c.prop)
    this.getAllAccount();
  }
  viewEmDetails(modal, id) {
    for (let employee of this.listAccount) {
      if (employee.id === id) {
        this.employeeInfo = employee;
        this.modalService.open(modal, { backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
      }
    }
  }

  getAllAccount() {
    this.isSpinning = true;
    this.accountServices.getAllEmployee().subscribe(
      (res) => {
        const accounts: any = res;
        console.log('res; ');

        console.log(res);

        if (accounts != null) {
          accounts.forEach(element => {
            let item = {};
            item['id'] = element.id;
            item['primary_email'] = element.primary_email;
            item['personal_email'] = element.personal_email;
            item['phone'] = element.phone;
            item['name'] = element.first_name + " " + element.last_name;
            item['status'] = element.status_id;
            item['is_sync'] = element.is_sync;
            item['departmentName'] = element.department.name;
            let team = new Array();
            for (let teamRes of element.team_employees) {
              team.push(teamRes.team.name);
            }
            item['team'] = team;
            item['position_name'] = element.position_in_company.name;
            item['vacation_start'] = moment.utc(element.vacation_start_date).local().format('DD-MM-YYYY') ? moment.utc(element.vacation_start_date).local().format('DD-MM-YYYY') : "Have no vacation start date";
            item['vacation_end'] = moment.utc(element.vacation_end_date).local().format('DD-MM-YYYY') ? moment.utc(element.vacation_end_date).local().format('DD-MM-YYYY') : "Have no vacation end date";
            // item['created_date'] = moment.utc(element.created_date).local().format('LLLL');
            // item['modified_date'] = moment.utc(element.modified_date).local().format('LLLL');
            this.listAccount.push(item);
          });
          // console.log(listAccount);
          this.dataSource = new MatTableDataSource(this.listAccount);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        this.isSpinning = false;
        console.log('list employee: ');

        console.log(this.listAccount);

      },
      (error) => {
        if (error.status == 0) {
          this.toast.error("Connection timeout!");
        } if (error.status == 400) {
          this.toast.error("Server is not available!");
        }
        this.toast.error("Server is not available!");
        this.isSpinning = false;
      }
    );
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
}
