import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompanyServices } from '../../api-services/company.services';
import { AccountCompanyModel } from '../../model/accounts';

@Component({
  selector: 'app-company-config-connection',
  templateUrl: './company-config-connection.component.html',
  styleUrls: ['./company-config-connection.component.css']
})
export class CompanyConfigConnectionComponent implements OnInit {
  accessDBForm: FormGroup;

  APIEndpointForm: FormGroup;
  account;
  constructor(
    private toast: ToastrService,
    private companyServices: CompanyServices,
    private fb: FormBuilder,
  ) {

  }

  ngOnInit() {
    this.createAForm();
    this.createFormApiEndpoint();
  }

  createAForm() {
    this.accessDBForm = this.fb.group({
      connectionName: new FormControl('', [Validators.required, Validators.email]),
      hostname: new FormControl('', [Validators.required]),
      port: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });


  }

  createFormApiEndpoint() {
    this.APIEndpointForm = this.fb.group({
      url: new FormControl('', [Validators.required]),
    });
  }


// api endpoint
  onSubmitURLConection(value) {
    this.account = new AccountCompanyModel();
    this.account.id = localStorage.getItem('id');
    this.account.api_endpoint  =  value.url;
    console.log(this.account);
    this.companyServices.updateAccountCompany(this.account).subscribe(
      (res) => {
        this.toast.success("Update Account success!");
      },
      (error) => {
        this.toast.error("Server is not available!");
      }
    )
  }


  // conection string 
  onSubmitConection(value) {
    // let connectionString = value.hostname
    this.account = new AccountCompanyModel();
    this.account.id = localStorage.getItem('id');
    this.account.connection_database  =  JSON.stringify(value);
    console.log(this.account);
    this.companyServices.updateAccountCompany(this.account).subscribe(
      (res) => {
        this.toast.success("Update Account success!");
      },
      (error) => {
        this.toast.error("Server is not available!");
      }
    )
  }



}
