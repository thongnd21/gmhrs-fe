import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompanyServices } from '../../api-services/company.services';

@Component({
  selector: 'app-company-config-connection',
  templateUrl: './company-config-connection.component.html',
  styleUrls: ['./company-config-connection.component.css']
})
export class CompanyConfigConnectionComponent implements OnInit {
  accessDBForm: FormGroup;
  isOptional = false;
  APIEndpointForm: FormGroup;
  days=[
    {
      id: 0,
      name:'Monday'
    },
    {
      id: 1,
      name:'Monday'
    },
    {
      id: 2,
      name:'Tuesday'
    },
    {
      id: 3,
      name:'Wednesday'
    },
    {
      id: 4,
      name:'Thursday'
    },
    {
      id: 5,
      name:'Friday'
    },
    {
      id: 6,
      name:'Saturday'
    },
  ];
  getDaysOfWeek: FormGroup;
  getTime: FormGroup;
  timeForm : FormGroup;
  constructor(
    private toast: ToastrService,
    private companyServices: CompanyServices,
    private fb: FormBuilder,
  ) {

  }

  ngOnInit() {
    this.createAForm();
    this.createFormApiEndpoint();
    this.getDaysOfWeek = this.fb.group({
      multiday: ['']
    });
    this.mainForm();
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

  //dynamic
  mainForm() {
    this.getTime = this.fb.group({
        time: this.fb.array([
            this.addTimeForm()
        ])
    });

  }

  onAddTime() {
      (<FormArray>this.getTime.controls['time']).push(this.addTimeForm());

  }

  addTimeForm(): FormGroup {
      this.timeForm = this.fb.group({
          timeControl: ['', Validators.required],
      });
      return this.timeForm;
  }
  removeUnit(i: number) {
      const control = <FormArray>this.getTime.controls['time'];
      control.removeAt(i);
  }



}
