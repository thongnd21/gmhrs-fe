import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-config-connection',
  templateUrl: './company-config-connection.component.html',
  styleUrls: ['./company-config-connection.component.css']
})
export class CompanyConfigConnectionComponent implements OnInit {
  accessDBForm: FormGroup;

  constructor(
    private toast: ToastrService,
    private fb: FormBuilder,
  ) {

  }

  ngOnInit() {
    this.createAForm();
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

  // conection string , them filed check box kieu database
  onSubmitConection(value){
    // let connectionString = value.hostname
    console.log(JSON.stringify(value));
  }



}
