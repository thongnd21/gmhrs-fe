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
  loadingFull = true;
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
      prop: 'status',
      name: 'status'
    },
    {
      prop: 'action',
      name: 'action'
    },
  ];
  account;
  accountInfo ={};
  constructor(
    private modalService: NgbModal,
    private companyServices: CompanyServices,
    private toast: ToastrService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.displayedColumns = this.column.map((c) => c.prop);
    this.getAllCompany();
  }

  getAllCompany() {
    this.loadingFull = true;
    this.companyServices.getAllCompany().subscribe(
      (data: any) => {
        this.loadingFull = false;
        console.log(data);
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
          item['address'] = company.address;
          item['phone'] = company.phone;
          item['connection_database'] = company.connection_database;
          item['api_endpoint'] = company.api_endpoint;
          list.push(item);
        });
        this.dataSource = new MatTableDataSource(list);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error)=>{
        this.loadingFull = false;
        if (error.status == 0) {
          this.toast.error("Connection timeout!");
        } if (error.status == 400) {
          this.toast.error("Server is not available!");
        }
      }
    )
  }

  getAccountCompanyById(id) {
    this.account = new AccountCompanyModel;
    this.companyServices.getAccountCompanyById(id).subscribe(
      (data: any) => {
        let basicAuth = atob(data.basic_auth_endpoint);
        console.log(basicAuth + "aaaaaaaaa");
        
        // let username = basicAuth.split(":")[0];
        // let password = basicAuth.split(":")[1];
        this.account.id = data.id;
        this.account.email = data.email;
        this.account.username = data.username;
        this.account.created_date = moment.utc(data.created_date).local().format('LLLL');
        this.account.modified_date = moment.utc(data.modified_date).local().format('LLLL');
        // this.account.role = data.role.name;
        this.account.address = data.address;
        this.account.phone = data.phone;
        this.account.status_id = data.status_id;
        this.account.token_api_endpoint = data.token_api_endpoint;
        this.account.basic_auth_endpoint = basicAuth;

        console.log(this.account + "aaaaaaaaa");
      },
      (error)=>{
        this.loadingFull = false;
        if (error.status == 0) {
          this.toast.error("Connection timeout!");
        } if (error.status == 400) {
          this.toast.error("Server is not available!");
        }
      }

    )
  }

  opentUpdate(update, data) {
    this.account = new AccountCompanyModel();
    console.log(data);
    this.account.id = data.id;
    this.account.email = data.email;
    this.account.username = data.username;
    this.account.created_date = data.created_date;
    this.account.modified_date = data.modified_date;
    this.account.role = data.role;
    this.account.address = data.address;
    this.account.phone = data.phone;
    this.account.connection_database = data.connection_database;
    this.account.api_endpoint = data.api_endpoint;
    console.log(this.account);

    this.accountCompanyForm = new FormGroup({
      id: new FormControl(this.account.id),
      email: new FormControl(this.account.email, [Validators.required, Validators.email]),
      username: new FormControl(this.account.username, [
        Validators.required,
        Validators.pattern(new RegExp(/(^[a-zA-Z0-9]*$)/g)),
        Validators.minLength(2),
        Validators.maxLength(30)
      ]),
      address: new FormControl(this.account.address),
      phone: new FormControl(this.account.phone, [
        Validators.required,
        Validators.maxLength(15),
      ]),
      created_date: new FormControl(this.account.created_date),
      modified_date: new FormControl(this.account.modified_date),
      api_endpoint: new FormControl(this.account.api_endpoint),
      connection_database: new FormControl(this.account.connection_database)
    });

    this.modalService.open(update, { backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
  }

  openDetail(modal, id) {
    this.getAccountCompanyById(id);
    this.modalService.open(modal, { backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
  }

  open(modal) {
    this.accountCompanyForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      username: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6)
      ]),
      phone: new FormControl("", [
        Validators.required,
        Validators.maxLength(15)
    ]),
    });
    this.accountCompanyForm.setValue({
      email: '',
      username: '',
      password: '',
      phone :''
    });
    this.modalService.open(modal, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
  }

  closeModal() {
    this.modalService.dismissAll();
  }


  updateAccountCompany(data) {
    this.loadingFull = true;
    this.account = new AccountCompanyModel()
    this.account.id = data.id;
    this.account.email = data.email;
    this.account.address = data.address;
    this.account.phone = data.phone;
    console.log(this.account);
    this.account.api_endpoint = data.api_endpoint,
    // this.account.connection_database = data.connection_database
    this.companyServices.updateAccountCompany(this.account).subscribe(
      (res) => {
        this.toast.success("Update Account successfully!");
        this.getAllCompany();
        this.closeModal();
      },
      (error) => {
        this.closeModal();
        this.loadingFull = false;
        if (error.status == 0) {
          this.toast.error("Connection timeout!");
        } if (error.status == 400) {
          this.toast.error("Server is not available!");
        }
      }
    )

  }

  createAccountCompany() {
    this.loadingFull = true;
    this.account = new AccountCompanyModel();
    this.account.email = this.accountCompanyForm.controls['email'].value,
      this.account.username = this.accountCompanyForm.controls['username'].value,
      this.account.password = this.accountCompanyForm.controls['password'].value,
      this.companyServices.createAccountCompany(this.account).subscribe(
        (res) => {
          this.closeModal();
          this.loadingFull = false;
          this.toast.success("Create Account successfully!");
          this.getAllCompany();
        },
        (error) => {
          this.closeModal();
          this.loadingFull = false;
          if (error.status == 0) {
            this.toast.error("Connection timeout!");
          } if (error.status == 400) {
            this.toast.error("Server is not available!");
          }
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

  changeDetail(){
    this.loadingFull = true;
    let status_id = 1;
    if(this.accountInfo['status_id'] === 1){
      status_id =  Number(2);
    }else{
      status_id = Number(1);
    }
    const accInfo = {
      id : this.accountInfo['id'],
      status_id : status_id,
    } 
    this.companyServices.changeAccountCompany(accInfo).subscribe(
      (res) => {
        this.dialog.closeAll();
        this.loadingFull = false;
        this.toast.success("Change status successfully!");
        this.getAllCompany();
      },
      (error) => {
        this.dialog.closeAll();
        this.loadingFull = false;
        if (error.status == 0) {
          this.toast.error("Connection timeout!");
        } if (error.status == 400) {
          this.toast.error("Server is not available!");
        }
      }
    );
  }

  openDialogChangeConfirm(dialog,event,account) {
    this.accountInfo['id'] = account.id;
    this.accountInfo['status_id'] = account.status_id;
    event.source.checked = account.status_id === 1 ? true : false;
    const dialogRef = this.dialog.open(dialog);
  }

}
