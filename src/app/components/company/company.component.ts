import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { CompanyServices } from '../../api-services/company.services';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AccountCompanyModel } from '../../model/accounts';
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
  account;

  constructor(
    private modalService: NgbModal,
    private companyServices: CompanyServices,
    private toast: ToastrService,
    private router: Router,
  ) {}

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
          item['role'] = company.role.name;
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

  getAccountCompanyById(id) {console.log(id);
    this.account = new AccountCompanyModel;
    this.companyServices.getAccountCompanyById(id).subscribe(
      (data: any) => {
        console.log(data);
        this.account.id = data.id;
        this.account.email = data.email;
        this.account.username = data.username;
        this.account.created_date = moment.utc(data.created_date).local().format('LLLL');
        this.account.modified_date = moment.utc(data.modified_date).local().format('LLLL');
        this.account.role = data.role.name;
        console.log(this.account);
      }

    )
  }

  opentUpdate(update,data){
    console.log(data);
    this.account = new AccountCompanyModel();
    this.account.id = data.id;
    this.account.email = data.email;
    this.account.username = data.username;
    this.account.created_date = data.created_date;
    this.account.modified_date = data.modified_date;
    this.account.role = data.role;
    console.log(this.account);
    this.accountCompanyForm = new FormGroup({
      email: new FormControl(this.account.email, [Validators.required, Validators.email]),
      username: new FormControl(this.account.username, [
        Validators.required,
        Validators.pattern(new RegExp(/(^[a-zA-Z0-9]*$)/g)),
        Validators.minLength(2),
        Validators.maxLength(30)
      ]),
      role: new FormControl(this.account.role, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15)
      ]),
    });
    // this.accountCompanyForm.setValue({
    //   email: this.account.email,
    //   username: this.account.username,
    //   role: this.account.role,
    // });
    this.modalService.open(update, { backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
  }

  openDetail(detail,id) {
    this.getAccountCompanyById(id);
    this.modalService.open(detail, { backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
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
      
    });
    this.accountCompanyForm.setValue({
      email: '',
      username: '',
      password: '',
    });
    this.modalService.open(modal, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  createAccountCompany() {
    this.account = new AccountCompanyModel();
    // const newAccountCompany = {
      this.account.email=  this.accountCompanyForm.controls['email'].value,
      this.account.username= this.accountCompanyForm.controls['username'].value,
      this.account.password= this.accountCompanyForm.controls['password'].value,

    // }
    this.companyServices.createAccountCompany(this.account).subscribe(
      (res) => {
        this.toast.success("Create Account success!");
        this.getAllCompany();
        this.closeModal();
      },
      (error) => {
        this.toast.error("Server is not available!");
        this.closeModal();
      }
    );
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
