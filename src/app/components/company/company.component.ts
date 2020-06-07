import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { CompanyServices } from '../../api-services/company.services';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [];
  isLoading = true;
  dataSource: any;
  accountCompanyForm: FormGroup;
  column = [
    {
      prop: 'email',
      name: 'email'
    },
    {
      prop: 'username',
      name: 'username'
    },
    {
      prop: 'created_date',
      name: 'created_date'
    },
    {
      prop: 'modified_date',
      name: 'modified_date'
    },
    {
      prop: 'action',
      name: 'action'
    },
  ];
  
  constructor(
    private modalService: NgbModal,
    private companyServices: CompanyServices,
  ) {

  }

  ngOnInit(): void {
    this.displayedColumns = this.column.map((c) => c.prop);
    this.getAllCompany();
  }

  getAllCompany() {
    this.companyServices.getAllCompany().subscribe(
      (data: any) => {
        let list = [];
        data.forEach(company => {
          let item = {};
          item['id'] = company.id;
          item['email'] = company.email;
          item['username'] = company.username;
          item['created_date'] = moment.utc(company.created_date).local().format('LLLL');
          item['modified_date'] = moment.utc(company.modified_date).local().format('LLLL');
          item['role_id'] = company.role_id;
          item['status_id'] = company.status_id;
          list.push(item);
          console.log(item);
        });
        console.log(list);
        this.dataSource = new MatTableDataSource(list);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    )
  }

  open(modal) {
    this.accountCompanyForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      username: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30)
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30)
      ]),
      // personal_email: new FormControl("", [Validators.required, Validators.email]),
      // phone: new FormControl("", [
      //   Validators.required,
      //   Validators.pattern(new RegExp(/((09|03|07|08|05)+([0-9]{8})\b)/g))
      // ]),
      // address: new FormControl("", [
      //   Validators.required,
      //   Validators.minLength(5),
      //   Validators.maxLength(50)
      // ]),
      // departmentId: new FormControl("")
    });
    this.accountCompanyForm.setValue({
      email : '',
      username : '',
      password : '',
      // personal_email : '',
      // phone:'',
      // address:'',
      // departmentId : this.departmentList[0].id
    });
  this.modalService.open(modal, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
}

closeModal() {
  this.modalService.dismissAll();
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

  ngAfterViewInit() {

  }

  setPage(event) {

  }

}
