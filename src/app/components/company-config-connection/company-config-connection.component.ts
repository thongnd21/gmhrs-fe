import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompanyServices } from '../../api-services/company.services';

@Component({
  selector: 'app-company-config-connection',
  templateUrl: './company-config-connection.component.html',
  styleUrls: ['./company-config-connection.component.css']
})
export class CompanyConfigConnectionComponent implements OnInit {
  accessDBForm: FormGroup;

  APIEndpointForm: FormGroup;

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



  onSubmitURLConection(value) {
    console.log(JSON.stringify(value));
    this.companyServices.updateAccountCompany(JSON.stringify(value)).subscribe(
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
    console.log(JSON.stringify(value));
    this.companyServices.updateAccountCompany(JSON.stringify(value)).subscribe(
      (res) => {
        this.toast.success("Update Account success!");
      },
      (error) => {
        this.toast.error("Server is not available!");
      }
    )
  }



}
