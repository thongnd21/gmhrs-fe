import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompanyServices } from '../../api-services/company.services';
import { AccountCompanyModel } from '../../model/accounts';
import { CompanyConnection } from '../../model/company_connection';
import { CompanyConnectionService } from '../../api-services/company-connection-api.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-company-config-connection',
  templateUrl: './company-config-connection.component.html',
  styleUrls: ['./company-config-connection.component.css']
})
export class CompanyConfigConnectionComponent implements OnInit {
  accessDBForm: FormGroup;
  isOptional = false;
  APIEndpointForm: FormGroup;
  account;
  fileContent;
  file;
  companyConnection;
  controls;
  days = [
    {
      id: 0,
      name: 'Monday'
    },
    {
      id: 1,
      name: 'Monday'
    },
    {
      id: 2,
      name: 'Tuesday'
    },
    {
      id: 3,
      name: 'Wednesday'
    },
    {
      id: 4,
      name: 'Thursday'
    },
    {
      id: 5,
      name: 'Friday'
    },
    {
      id: 6,
      name: 'Saturday'
    },
  ];
  getDaysOfWeek: FormGroup;
  getTime: FormGroup;
  timeForm: FormGroup;
  constructor(
    private toast: ToastrService,
    private companyServices: CompanyServices,
    private companyConnectionService: CompanyConnectionService,
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
    this.controls = this.getTime.controls.time;
  }

  createAForm() {
    this.accessDBForm = this.fb.group({
      dbName: new FormControl('', [Validators.required, Validators.email]),
      host: new FormControl('', [Validators.required]),
      port: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      dialect: new FormControl(''),
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
    this.account.api_endpoint = value.url;
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


  // test connection string
  onTestConection(value) {
    this.companyConnection = new CompanyConnection();
    this.companyConnection.dbName = value.dbName;
    this.companyConnection.host = value.host;
    this.companyConnection.port = value.port;
    this.companyConnection.username = value.username;
    this.companyConnection.password = value.password;
    this.companyConnection.dialect = value.dialect;
    console.log(this.companyConnection);
    this.companyConnectionService.testDBCompanyConnection(this.companyConnection).subscribe(
      (res) => {
        const status: any = res;
        if (status.status == 0) {
          this.toast.error("Connection fail!!");
        } else if (status.status == 200) {
          this.toast.success("Database connection success!");
        }
      },
      (error) => {
        this.toast.error("Server is not available!");
      }
    )
  }

  // save connection string
  onSubmitConection(value) {
    this.companyConnection = new CompanyConnection();
    this.companyConnection.dbName = value.dbName;
    this.companyConnection.host = value.host;
    this.companyConnection.port = value.port;
    this.companyConnection.username = value.username;
    this.companyConnection.password = value.password;
    this.companyConnection.dialect = value.dialect;
    const connectionString =
      this.companyConnection.dbName + " " +
      this.companyConnection.host + " " +
      this.companyConnection.port + " " +
      this.companyConnection.username + " " +
      this.companyConnection.password + " " +
      this.companyConnection.dialect
    console.log(connectionString);
    this.companyServices.updateAccountCompany(connectionString).subscribe(
      (res) => {
        this.toast.success("Save connection success!");
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

  submit() {
    let date = JSON.stringify(this.fileContent);
    console.log(date);
  }

  public onChange(fileList: FileList): void {
    let file = fileList[0];
    let fileReader: FileReader = new FileReader();
    let self = this;
    fileReader.onloadend = function () {
      self.fileContent = fileReader.result;
    }
    fileReader.readAsText(file);
  }
}
