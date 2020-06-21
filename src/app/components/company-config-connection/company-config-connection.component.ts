import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompanyServices } from '../../api-services/company.services';
import { AccountCompanyModel } from '../../model/accounts';
import { CompanyConnection } from '../../model/company_connection';
import { CompanyConnectionService } from '../../api-services/company-connection-api.service';
import { FileUpload } from '../../api-services/file-upload-api.service';
import { from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { data } from 'jquery';

@Component({
  selector: 'app-company-config-connection',
  templateUrl: './company-config-connection.component.html',
  styleUrls: ['./company-config-connection.component.css']
})
export class CompanyConfigConnectionComponent implements OnInit {
  accessDBForm: FormGroup;
  connection = true;
  isOptional = false;
  gsuiteCredentialForm: FormGroup;
  APIEndpointForm: FormGroup;
  account;
  fileContent;
  file;
  companyConnection;
  controls;
  typeSync;
  dayInMonth : Array<Number>= []; 
  uploadedFiles: Array<File>;
  days = [
    {
      id: 0,
      name: 'Sunday '
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
  constructor(
    private toast: ToastrService,
    private companyServices: CompanyServices,
    private companyConnectionService: CompanyConnectionService,
    private fileUploadServices: FileUpload,
    private fb: FormBuilder,
    private http: HttpClient,
  ) {

  }

  ngOnInit() {
    this.createAForm();
    this.createFormApiEndpoint();
    for(let i = 1; i < 32; i++){
      this.dayInMonth.push(i);
    }
    this.createGsuiteCredentialForm();
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

  createGsuiteCredentialForm() {
    this.gsuiteCredentialForm = this.fb.group({
      company_email: new FormControl('', [Validators.required, Validators.email]),
      file: new FormControl('')
    })
  }


  fileChange(element) {
    this.uploadedFiles = element.target.files;
  }

  upload(value) {
    let formData = new FormData();
    console.log(this.uploadedFiles);
    console.log(value.file);
    let company_email = value.company_email;
    let id_company = localStorage.getItem('id');
    for (var i = 0; i < this.uploadedFiles.length; i++) {
      formData.append("file", this.uploadedFiles[i], this.uploadedFiles[i].name);
    }
    formData.set("company_email", company_email);
    formData.set("id", id_company);
    console.log(formData);

    this.account = new AccountCompanyModel();
    this.account.id = localStorage.getItem('id');
    this.http.post('https://gmhrs-api.herokuapp.com/api/file/upload', formData)
      .subscribe(
        (res) => {
          this.toast.success("Upload file success!");
        },
        (error) => {
          this.toast.error("Server is not available!");
        })
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

  submit() {
    let date = JSON.stringify(this.fileContent);
    this.fileUploadServices.uploadFile(date).subscribe(
      (res) => {
        this.toast.success("Save connection success!");
      },
      (error) => {
        this.toast.error("Server is not available!");
      }
    )
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
