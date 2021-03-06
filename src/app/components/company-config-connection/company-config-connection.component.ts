import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, FormControlName } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompanyServices } from '../../api-services/company.services';
import { AccountCompanyModel } from '../../model/accounts';
import { CompanyConnection } from '../../model/company_connection';
import { CompanyConnectionService } from '../../api-services/company-connection-api.service';
import { FileUpload } from '../../api-services/file-upload-api.service';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { data } from 'jquery';
import { MatDialog, MatStepper } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountApiService } from '../../api-services/account-api.service';
import { STRING_TYPE, ThrowStmt } from '@angular/compiler';
import { Router } from '@angular/router';


@Component({
  selector: 'app-company-config-connection',
  templateUrl: './company-config-connection.component.html',
  styleUrls: ['./company-config-connection.component.css']
})
export class CompanyConfigConnectionComponent implements OnInit {
  accessDBForm: FormGroup;
  connection = true;
  authconnection = true;
  timeMonthDate = true;
  isOptional = false;
  gsuiteCredentialForm: FormGroup;
  APIEndpointForm: FormGroup;
  tokenForm: FormGroup;
  basicForm: FormGroup;
  connection_method = "";
  account;
  fileContent;
  selected = 'Basic Auth';
  accessGsuiteAuthen = {//response test authen gsuite (primary_email + file json)
    employee: {
      status: String,
      message: String
    },
    team: {
      status: String,
      message: String
    },
    department: {
      status: String,
      message: String
    },
    member: {
      status: String,
      message: String
    },
    gmail: {
      status: String,
      message: String
    }
  };
  file;
  companyConnection;
  loadingSaveMapping = false;
  controls;
  typeSync;
  dayInMonth: Array<Number> = [];
  monthDayChoose;
  weekDayChoose;
  timeChoose;
  uploadedFiles: Array<File>;
  loading = false;
  loadingConfirm = false;
  gsuiteAuthenStatus = true;
  loadingSubmit = false;
  loadingTestConnection = false;
  loadingTestAPI = false;
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
  checkSync;
  monthTime;
  dailyTime;
  weekTime;
  schedule = {};
  timeSchedule = "";
  anableButtonSaveAPIEndpoint = false;// disable button save api endpoint
  enableDataAPIResult = false;// enable/disable json checking api endpoint when click button test
  enableDataConnectionResult = false
  dataAPIEndpoindEmployee = { // json format employee to admin company checking field when input api endpoint
    employee: {
      id: "Required",
      primary_email: "Required",
      personal_email: "Required",
      first_name: "Required",
      last_name: "Required",
      phone: "Required",
      address: "Required",
      position_id: "Required",
      department: {
        id: "Required",
        name: "Required",
      },
      vacation_start_date: "Required",
      vacation_end_date: "Required"
    }

  };
  dataAPIEndpoindDepartment = {// json format department to admin company checking field when input api endpoint
    department: {
      id: "Required",
      name: "Required",
      email: "Required",
      description: "Optional"
    }
  };
  dataAPIEndpoindTeam = {// json format team to admin company checking field when input api endpoint
    team: {
      id: "Required",
      name: "Required",
      email: "Required",
      member: [
        {
          id: "Required",
          primary_email: "Required"
        }
      ],
      description: "Optional",

    }
  };
  dataAPIEndpoindPosition = {// json format team to admin company checking field when input api endpoint
    position: {
      id: "Required",
      name: "Required"
    }
  };
  connectionString = {
    host: " ",
    dbName: " ",
    port: " ",
    username: " ",
    password: " ",
    type: " "
  };
  apiEndpointResultEmployeeList = [];
  apiEndpointResultDepartmentList = [];
  apiEndpointResultTeamList = [];
  apiEndpointResultPositionList = [];
  disableSaveConnectionStringButton = false;
  disableTestConnectionStringButton = true;
  employees = {
    employee: {
    }
  };

  departments = {
    department: {

    }
  }
  teams = {
    team: {

    }
  };
  members = [];
  member = {};
  employeeValidate = false;
  departmentValidate = false;
  teamValidate = false;
  positionValidate = false;
  connectionStringDataResponseEmployeeJSON;
  connectionStringDataResponseEmployee = { // json format employee to admin company checking field when input api endpoint
    employee: {
      id: "Required",
      primary_email: "Required",
      personal_email: "Required",
      first_name: "Required",
      last_name: "Required",
      phone: "Required",
      address: "Required",
      position_id: "Required",
      department_id: "Required",
      vacation_start_date: "Required",
      vacation_end_date: "Requried"
    }
  };
  connectionStringDataResponseDepartment = {// json format department to admin company checking field when input api endpoint
    department: {
      id: "Required",
      name: "Required",
      email: "Required",
      description: "Optional"
    }
  };
  connectionStringDataResponseTeam = {// json format team to admin company checking field when input api endpoint
    team: {
      id: "Required",
      name: "Required",
      email: "Required",
      description: "Optional",

    }
  };
  connectionStringDataResponseTeamEmployee = {// json format team to admin company checking field when input api endpoint
    team_employee: {
      employee_id: "Required",
      team_id: "Required"
    }
  };
  connectionStringDataResponsePositon = {// json format postion to admin company checking field when input api endpoint
    position: {
      id: "Required",
      name: "Required"
    }
  };
  connectionStringDataResponseVacation = {// json format postion to admin company checking field when input api endpoint
    vacation: {
      employee_id: "Required",
      start_date: "Required",
      end_date: "Required"
    }
  };
  connectionStatus = {
    connection: {
      status: "",
      message: ""
    }
  }
  connectionFail = false;
  apiEndpointFail = false;
  nextButonConditonConnectionString = false;
  nextButonConditonApiEnpoint = false;
  nextButonConditonGSuiteCredential = false;
  file_name_auth_gsuite_company;
  loadingFull = false;
  tableMappingModel = [
    {
      tableName: "employee",

      fields: [
        { field: "id", status: "Not mapping yet" },
        { field: "primary_email", status: "Not mapping yet" },
        { field: "personal_email", status: "Not mapping yet" },
        { field: "first_name", status: "Not mapping yet" },
        { field: "last_name", status: "Not mapping yet" },
        { field: "phone", status: "Not mapping yet" },
        { field: "address", status: "Not mapping yet" },
        { field: "position_id", status: "Not mapping yet" },
        { field: "department_id", status: "Not mapping yet" }
      ]

    },
    {
      tableName: "department",
      fields: [
        { field: "id", status: "Not mapping yet" },
        { field: "name", status: "Not mapping yet" },
        { field: "email", status: "Not mapping yet" }
      ]
    },
    {
      tableName: "team",
      fields: [
        { field: "id", status: "Not mapping yet" },
        { field: "name", status: "Not mapping yet" },
        { field: "email", status: "Not mapping yet" },
      ]
    },
    {
      tableName: "team_employee",
      fields: [
        { field: "employee_id", status: "Not mapping yet" },
        { field: "team_id", status: "Not mapping yet" }
      ]
    },
    {
      tableName: "position",
      fields: [
        { field: "id", status: "Not mapping yet" },
        { field: "name", status: "Not mapping yet" }
      ]
    },
    {
      tableName: "vacation_date",
      status: "",
      fields: [
        { field: "employee_id", status: "Not mapping yet" },
        { field: "start_date", status: "Not mapping yet" },
        { field: "end_date", status: "Not mapping yet" }
      ]
    },
  ]
  mappingTableResult = [
    {
      tableGM: "gmhrs_employee_view",
      tableHR:
      {
        nametableHR: "",
        fields: [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ]

      }
    },
    {
      tableGM: "gmhrs_department_view",
      tableHR:
      {
        nametableHR: "",
        fields: [
          "",
          "",
          ""
        ]
      }
    },
    {
      tableGM: "gmhrs_team_view",
      tableHR:
      {
        nametableHR: "",
        fields: [
          "",
          "",
          ""
        ]
      }
    },
    {
      tableGM: "gmhrs_team_employee_view",
      tableHR:
      {
        nametableHR: "",
        fields: [
          "",
          "",
        ]
      }
    },
    {
      tableGM: "gmhrs_position_view",
      tableHR:
      {
        nametableHR: "",
        fields: [
          "",
          ""
        ]
      }
    },
    {
      tableGM: "gmhrs_vacation_date_view",
      tableHR:
      {
        nametableHR: "",
        fields: [
          "",
          "",
          ""
        ]

      }
    }
  ]
  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private modalService: NgbModal,
    private toast: ToastrService,
    private companyServices: CompanyServices,
    private companyConnectionService: CompanyConnectionService,
    private fileUploadServices: FileUpload,
    private fb: FormBuilder,
    private http: HttpClient,
    public dialog: MatDialog,
    private accountServices: AccountApiService,
    private router: Router,
  ) {

  }

  ngOnInit() {
    this.getSchedule();
    this.createConnectionStringForm();
    this.createFormApiEndpoint();
    // this.createFormTokenAuth();
    // this.createFormBasicAuth();
    for (let i = 1; i < 32; i++) {
      this.dayInMonth.push(i);
    }
    this.createGsuiteCredentialForm();
    console.log(this.checkSync);
  }

  goToGuidePage(): void {
    this.router.navigate(['/guides']);
  }

  changeMethod(method): void {
    if (method === "API") {
      this.connection_method = "API endpoint";
    } else if (method === "DB") {
      this.connection_method = "Database mapping";
    }
  }
  // form connection String
  createConnectionStringForm() {
    this.loadingFull = true;
    const accountId = localStorage.getItem('id');
    // this.account = new AccountCompanyModel;
    this.nextButonConditonConnectionString = false;
    this.accessDBForm = this.fb.group({
      dbName: new FormControl('', [Validators.required]),
      host: new FormControl('', [Validators.required]),
      port: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      dialect: new FormControl('mysql'),
    });
    this.companyServices.getAccountCompanyById(accountId).subscribe(
      (res: any) => {
        if (res.connection_database != undefined) {
          this.loadingFull = false;
          console.log(res.connection_database);
          var connectionString = res.connection_database
          var dbName = connectionString.split(" ")[0];
          var host = connectionString.split(" ")[1];
          var port = connectionString.split(" ")[2];
          var username = connectionString.split(" ")[3];
          var password = connectionString.split(" ")[4];
          var type = connectionString.split(" ")[5];

          this.connectionString.dbName = dbName;
          this.connectionString.host = host;
          this.connectionString.port = port;
          this.connectionString.username = username;
          this.connectionString.password = password;
          this.connectionString.type = type;
          this.connection = res.method_auth_connection != "API" ? true : false;
          if (res.method_auth_connection == "API") {
            this.connection_method = 'API endpoint'
          } else if (res.method_auth_connection == "DBM") {
            this.connection_method = 'Database mapping manually'
          } else if (res.method_auth_connection == "DB") {
            this.connection_method = 'Database mapping automatically'
          }
          this.accessDBForm = this.fb.group({
            dbName: new FormControl(this.connectionString.dbName, [Validators.required]),
            host: new FormControl(this.connectionString.host, [Validators.required]),
            port: new FormControl(this.connectionString.port, [Validators.required]),
            username: new FormControl(this.connectionString.username, [Validators.required]),
            password: new FormControl(this.connectionString.password, [Validators.required]),
            dialect: new FormControl(this.connectionString.type),
          });
          this.disableSaveConnectionStringButton = false;
          this.nextButonConditonConnectionString = true;

          // this.disableTestConnectionStringButton = false;
        }
        else {
          this.disableSaveConnectionStringButton = false;
          this.nextButonConditonConnectionString = false;
          this.loadingFull = false;
          // this.disableTestConnectionStringButton = true;
        }

      },
      (error) => {
        console.log(error);
      }
    );
  }
  createGsuiteCredentialForm() {
    const accountId = localStorage.getItem('id');
    this.nextButonConditonGSuiteCredential = false;
    this.gsuiteCredentialForm = this.fb.group({
      company_email: new FormControl('', [Validators.required, Validators.email]),
      file: new FormControl('', Validators.required)
    });
    this.companyServices.getAccountCompanyById(accountId).subscribe(
      (res: any) => {
        if (res.company_email != undefined) {
          console.log(res.company_email);
          this.gsuiteCredentialForm = this.fb.group({
            company_email: new FormControl(res.company_email, [Validators.required]),
            file: new FormControl(res.file_name_auth_gsuite_company)
          });
          this.file_name_auth_gsuite_company = res.file_name_auth_gsuite_company;
          this.disableSaveConnectionStringButton = false;
          this.nextButonConditonGSuiteCredential = true;
          this.disableTestAuthenGsuiteButton = false;
          // this.disableTestConnectionStringButton = false;
        }
        else {
          console.log("else");
          this.nextButonConditonGSuiteCredential = false;
          // this.disableTestConnectionStringButton = true;
        }
      },
      (error) => {
        this.loadingFull = false;
      }
    )

  }

  nextClicked(status) {
    // complete the current step
    this.stepper.selected.completed = true;
    // move to next step
    if (status == 1 && this.nextButonConditonConnectionString == true) {
      this.stepper.next();
      // console.log(this.nextButonConditon);
    } else if (status == 1 && this.nextButonConditonApiEnpoint == true) {
      this.stepper.next();
    }
    else if (status == 3 && this.nextButonConditonGSuiteCredential == true) {
      this.stepper.next();
    } else {
      this.toast.warning("Please complete this step!");
    }

  }

  disableTestAuthenGsuiteButton = true;
  fileChange(element) {
    this.uploadedFiles = element.target.files;
    var check = this.uploadedFiles[0].name.split('.').length;

    if (this.uploadedFiles[0].name.split('.')[check - 1] != "json") {
      this.toast.error("Please input only JSON file!");
      this.disableTestAuthenGsuiteButton = true;
    }
    else {
      this.disableTestAuthenGsuiteButton = false;
    }
  }


  //test file authen guite
  onTest(modal, value) {
    this.loadingFull = true;
    let formData = new FormData();
    let company_email = value.company_email;
    console.log(this.loadingFull);

    if (company_email == "" || company_email == null || company_email == undefined) {
      this.toast.error("Please input company email");
      this.loadingFull = false;
    } else {
      if (this.uploadedFiles != undefined) {
        for (var i = 0; i < this.uploadedFiles.length; i++) {
          formData.append("file", this.uploadedFiles[i], this.uploadedFiles[i].name);
          formData.set("company_email", company_email);
          this.sendFile(modal, formData);

        }
      }
      if (this.uploadedFiles == undefined) {
        var authenGsuite = {
          company_email: value.company_email,
          fileName: this.file_name_auth_gsuite_company
        }
        this.sendFile(modal, authenGsuite);
      }

    }

  }

  sendFile(modal, data) {

    this.companyConnectionService.gsuiteCredentialTest(data).subscribe(
      (res) => {
        const testInfor: any = res;
        this.accessGsuiteAuthen.employee.message = testInfor.checkingAuthGsuiteEmployee.message;
        this.accessGsuiteAuthen.team.message = testInfor.checkingAuthGsuiteTeam.message;
        this.accessGsuiteAuthen.department.message = testInfor.checkingAuthGsuiteDepartment.message;
        this.accessGsuiteAuthen.member.message = testInfor.checkingAuthGsuiteMember.message;
        this.accessGsuiteAuthen.gmail.message = testInfor.checkingAuthGsuiteMail.message;
        this.accessGsuiteAuthen.employee.status = testInfor.checkingAuthGsuiteEmployee.status;
        this.accessGsuiteAuthen.team.status = testInfor.checkingAuthGsuiteTeam.status;
        this.accessGsuiteAuthen.department.status = testInfor.checkingAuthGsuiteDepartment.status;
        this.accessGsuiteAuthen.member.status = testInfor.checkingAuthGsuiteMember.status;
        this.accessGsuiteAuthen.gmail.status = testInfor.checkingAuthGsuiteMail.status;
        console.log(testInfor);
        console.log(this.accessGsuiteAuthen);

        if (testInfor.checkingAuthGsuiteEmployee.status == 200
          && testInfor.checkingAuthGsuiteTeam.status == 200
          && testInfor.checkingAuthGsuiteDepartment.status === 200
          && testInfor.checkingAuthGsuiteMember.status === 200
          && testInfor.checkingAuthGsuiteMail.status === 200) {
          this.gsuiteAuthenStatus = false;
        } else {
          this.gsuiteAuthenStatus = true;
        }
        // console.log(this.gsuiteAuthenStatus);
        // this.toast.success("Upload file success!");
        //open modal
        this.loadingFull = false;
        this.modalService.open(modal, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
      },
      (error) => {
        this.loadingFull = false;
        this.toast.error("Server is not available!");
      })
  }

  //upload file authen gsuite
  upload(value) {
    this.loadingFull = true;
    this.account = new AccountCompanyModel;
    this.account.primary_email = value.company_email;
    this.account.id = localStorage.getItem('id');
    this.companyConnectionService.gsuiteCredentialSave(this.account)
      .subscribe(
        (res) => {
          this.loadingFull = false;
          const result: any = res;
          if (result.status == "success") {
            this.toast.success("Con-fig G-Suite Authentication Successfully!");
            this.nextButonConditonGSuiteCredential = true;
            this.closeModal();
          }
          if (result.status == "fail") {
            this.toast.error("Con-fig G-Suite Authentication fail!");
            this.nextButonConditonGSuiteCredential = false;
          }
        },
        (error) => {
          this.loadingFull = false;
          this.toast.error("Server is not available!");
          this.nextButonConditonGSuiteCredential = false;
        })
  }

  createFormApiEndpoint() {
    const accountId = localStorage.getItem('id');
    this.APIEndpointForm = this.fb.group({
      url: new FormControl('', [Validators.required]),
      tokenAuth: new FormControl(''),
      usernameAuth: new FormControl(''),
      passwordAuth: new FormControl('')
    });
    this.companyServices.getAccountCompanyById(accountId).subscribe(
      (res: any) => {
        console.log(res);
        var basicAuth = res.api_encrypt;
        var api_endpoint = basicAuth.split(" ")[0];
        var username = basicAuth.split(" ")[1];
        var password = basicAuth.split(" ")[2];
        var token = basicAuth.split(" ")[3];

        if (api_endpoint != undefined && api_endpoint.length > 1) {
          console.log(res.connection_database);
          this.APIEndpointForm = this.fb.group({
            url: new FormControl(api_endpoint, [Validators.required]),
            tokenAuth: new FormControl(token),
            usernameAuth: new FormControl(username),
            passwordAuth: new FormControl(password)
          });
          this.selected = res.method_auth_api_endpoint

          this.disableSaveConnectionStringButton = false;
          this.nextButonConditonApiEnpoint = true;
          // this.disableTestConnectionStringButton = false;
        }
        else {
          this.nextButonConditonApiEnpoint = false;
          // this.disableTestConnectionStringButton = true;
        }
      },
      (error) => {
        this.loadingFull = false;
      }
    )
  }

  createFormTokenAuth() {
    const accountId = localStorage.getItem('id');
    this.tokenForm = this.fb.group({
      tokenAuth: new FormControl('')
    });
    this.companyServices.getAccountCompanyById(accountId).subscribe(
      (res: any) => {
        console.log(res);
        // var basicAuth = atob(res.basic_auth_endpoint);

        if (res.api_endpoint != undefined && res.api_endpoint.length > 1) {
          console.log(res.connection_database);
          this.tokenForm = this.fb.group({
            // url: new FormControl(res.api_endpoint, [Validators.required]),
            tokenAuth: new FormControl(res.token_api_endpoint)
          });

          this.disableSaveConnectionStringButton = false;
          this.nextButonConditonApiEnpoint = true;
          // this.disableTestConnectionStringButton = false;
        }
        else {
          this.nextButonConditonApiEnpoint = false;
          // this.disableTestConnectionStringButton = true;
        }
      },
      (error) => {
        this.loadingFull = false;
      }
    )
  }


  createFormBasicAuth() {
    const accountId = localStorage.getItem('id');
    this.basicForm = this.fb.group({
      usernameAuth: new FormControl(),
      passwordAuth: new FormControl()
    });
    this.companyServices.getAccountCompanyById(accountId).subscribe(
      (res: any) => {
        console.log(res);
        var basicAuth = atob(res.basic_auth_endpoint);
        var username = basicAuth.split(":")[0];
        var password = basicAuth.split(":")[1];

        if (res.api_endpoint != undefined && res.api_endpoint.length > 1) {
          console.log(res.connection_database);
          this.basicForm = this.fb.group({
            // url: new FormControl(res.api_endpoint, [Validators.required]),
            usernameAuth: new FormControl(username),
            passwordAuth: new FormControl(password)
          });

          this.disableSaveConnectionStringButton = false;
          this.nextButonConditonApiEnpoint = true;
          // this.disableTestConnectionStringButton = false;
        }
        else {
          this.nextButonConditonApiEnpoint = false;
          // this.disableTestConnectionStringButton = true;
        }
      },
      (error) => {
        this.loadingFull = false;
      }
    )
  }

  // api endpoint
  onSubmitURLConection(value) {
    this.loadingFull = true;
    this.account = new AccountCompanyModel();
    this.account.id = localStorage.getItem('id');
    this.account.api_endpoint = value.url;
    this.account.usernameAuth = value.usernameAuth
    this.account.passwordAuth = value.passwordAuth
    this.account.tokenAuth = value.tokenAuth
    this.account.selected = this.selected
    console.log(this.account);
    this.companyServices.updateAccountCompany(this.account).subscribe(
      (res: any) => {
        this.loadingFull = false;
        if (res.status == "success") {
          this.toast.success("Save API Endpoint successfully!");
          this.nextButonConditonApiEnpoint = true;
          this.closeModal();
        }
        if (res.status == "fail") {
          this.toast.error("Save API Endpoint fail!");
          this.nextButonConditonApiEnpoint = false;
        }
      },
      (error) => {
        this.loadingFull = false;
        this.toast.error("Server is not available!");
        this.nextButonConditonApiEnpoint = false;
      }
    )
  }


  onTestURLConection(modal, value) {
    this.loadingFull = true;
    console.log(value);
    const endpoint = value.url
    const username = value.usernameAuth
    const password = value.passwordAuth
    const token = value.tokenAuth
    const selected = this.selected
    this.loadingTestAPI = true;
    this.enableDataAPIResult = false;
    this.apiEndpointFail = false;
    this.anableButtonSaveAPIEndpoint = false;
    this.accountServices.testAPIEndpoint(endpoint, username, password, token, selected).subscribe(
      (res: any) => {
        console.log(res);

        // if(res.employees.length>0 && res.departments.length>0 &&)
        console.log(res);

        this.connectionStatus.connection.status = "Success";
        this.apiEndpointResultEmployeeList = res.employees.length > 0 ? res.employees : null;
        this.apiEndpointResultDepartmentList = res.departments.length > 0 ? res.departments : null;
        this.apiEndpointResultTeamList = res.teams.length > 0 ? res.teams : null;
        this.apiEndpointResultPositionList = res.positions.length > 0 ? res.positions : null;
        var check = this.checkingFormatData(
          this.apiEndpointResultEmployeeList,
          this.apiEndpointResultDepartmentList,
          this.apiEndpointResultTeamList,
          this.apiEndpointResultPositionList);
        this.anableButtonSaveAPIEndpoint = check;
        this.apiEndpointFail = false;
        this.enableDataAPIResult = true;
        this.loadingTestAPI = false;
        this.loadingFull = false;
        this.modalService.open(modal, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
      },
      (error) => {
        // if(error.isAuthenticated!==undefined)
        if (error.status == 401) {
          this.connectionStatus.connection.status = error.statusText;
        } else {
          this.connectionStatus.connection.status = "Fail";
        }
        // this.connectionStatus.connection.status = "Fail";
        this.employeeValidate = false;
        this.teamValidate = false;
        this.departmentValidate = false;
        this.positionValidate = false;
        this.dataAPIEndpoindEmployee.employee.id = "Required";
        this.dataAPIEndpoindEmployee.employee.primary_email = "Required";
        this.dataAPIEndpoindEmployee.employee.personal_email = "Required";
        this.dataAPIEndpoindEmployee.employee.first_name = "Required";
        this.dataAPIEndpoindEmployee.employee.last_name = "Required";
        this.dataAPIEndpoindEmployee.employee.phone = "Required";
        this.dataAPIEndpoindEmployee.employee.address = "Required";
        this.dataAPIEndpoindEmployee.employee.department.id = "Required";
        this.dataAPIEndpoindEmployee.employee.department.name = "Required";
        this.dataAPIEndpoindDepartment.department.id = "Required";
        this.dataAPIEndpoindDepartment.department.name = "Required";
        this.dataAPIEndpoindTeam.team.id = "Required";
        this.dataAPIEndpoindTeam.team.name = "Required";
        this.dataAPIEndpoindTeam.team.email = "Required";
        this.dataAPIEndpoindTeam.team.member[0].id = "Required";
        this.dataAPIEndpoindTeam.team.member[0].primary_email = "Required";
        this.dataAPIEndpoindPosition.position.id = "Required";
        this.dataAPIEndpoindPosition.position.name = "Required";
        this.apiEndpointFail = true;
        this.loadingTestAPI = false;
        this.enableDataAPIResult = true;
        this.anableButtonSaveAPIEndpoint = false;
        this.loadingFull = false;
        this.modalService.open(modal, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
        // this.toast.error(error.message);
        console.log(error);
      }
    )
  }

  // checking data json from api endpoint result after test
  checkingFormatData(employee, department, team, position) {
    console.log(employee);

    //check fields in each employee
    for (var i = 0; i < employee.length; i++) {
      employee[i].id === undefined ? this.dataAPIEndpoindEmployee.employee.id = "Missing Field" : this.dataAPIEndpoindEmployee.employee.id = "Pass";
      employee[i].primary_email === undefined ? this.dataAPIEndpoindEmployee.employee.primary_email = "Missing Field" : this.dataAPIEndpoindEmployee.employee.primary_email = "Pass";
      employee[i].personal_email === undefined ? this.dataAPIEndpoindEmployee.employee.personal_email = "Missing Field" : this.dataAPIEndpoindEmployee.employee.personal_email = "Pass";
      employee[i].first_name === undefined ? this.dataAPIEndpoindEmployee.employee.first_name = "Missing Field" : this.dataAPIEndpoindEmployee.employee.first_name = "Pass";
      employee[i].last_name === undefined ? this.dataAPIEndpoindEmployee.employee.last_name = "Missing Field" : this.dataAPIEndpoindEmployee.employee.last_name = "Pass";
      employee[i].phone === undefined ? this.dataAPIEndpoindEmployee.employee.phone = "Missing Field" : this.dataAPIEndpoindEmployee.employee.phone = "Pass";
      employee[i].address === undefined ? this.dataAPIEndpoindEmployee.employee.address = "Missing Field" : this.dataAPIEndpoindEmployee.employee.address = "Pass";
      employee[i].department.id === undefined ? this.dataAPIEndpoindEmployee.employee.department.id = "Missing Field" : this.dataAPIEndpoindEmployee.employee.department.id = "Pass";
      employee[i].department.name === undefined ? this.dataAPIEndpoindEmployee.employee.department.name = "Missing Field" : this.dataAPIEndpoindEmployee.employee.department.name = "Pass";
      employee[i].department.name === undefined ? this.dataAPIEndpoindEmployee.employee.department.name = "Missing Field" : this.dataAPIEndpoindEmployee.employee.department.name = "Pass";
      employee[i].position_id === undefined ? this.dataAPIEndpoindEmployee.employee.position_id = "Missing Field" : this.dataAPIEndpoindEmployee.employee.position_id = "Pass";
      employee[i].vacation_start_date === undefined ? this.dataAPIEndpoindEmployee.employee.vacation_start_date = "Missing Field" : this.dataAPIEndpoindEmployee.employee.vacation_start_date = "Pass";
      employee[i].vacation_end_date === undefined ? this.dataAPIEndpoindEmployee.employee.vacation_end_date = "Missing Field" : this.dataAPIEndpoindEmployee.employee.vacation_end_date = "Pass";
      console.log("vong for: " + i);
      // if pass all field stop for 
      if (this.dataAPIEndpoindEmployee.employee.id == "Pass" && this.dataAPIEndpoindEmployee.employee.primary_email == "Pass"
        && this.dataAPIEndpoindEmployee.employee.first_name == "Pass" && this.dataAPIEndpoindEmployee.employee.last_name == "Pass"
        && this.dataAPIEndpoindEmployee.employee.phone == "Pass" && this.dataAPIEndpoindEmployee.employee.address == "Pass"
        && this.dataAPIEndpoindEmployee.employee.position_id == "Pass"
        && this.dataAPIEndpoindEmployee.employee.department.id == "Pass"
        && this.dataAPIEndpoindEmployee.employee.department.name == "Pass"
        && this.dataAPIEndpoindEmployee.employee.vacation_start_date == "Pass" && this.dataAPIEndpoindEmployee.employee.vacation_end_date == "Pass") {
        this.employeeValidate = true;
        i = employee.length - 1;
      }
    };
    //check field in each department
    for (var i = 0; i < department.length; i++) {
      department[i].id === undefined ? this.dataAPIEndpoindDepartment.department.id = "Missing Field" : this.dataAPIEndpoindDepartment.department.id = "Pass";
      department[i].name === undefined ? this.dataAPIEndpoindDepartment.department.name = "Missing Field" : this.dataAPIEndpoindDepartment.department.name = "Pass";
      department[i].name === undefined ? this.dataAPIEndpoindDepartment.department.email = "Missing Field" : this.dataAPIEndpoindDepartment.department.email = "Pass";
      console.log("vong for dep: " + i);
      //if pass all fields >> stop for
      if (this.dataAPIEndpoindDepartment.department.id == "Pass"
        && this.dataAPIEndpoindDepartment.department.name == "Pass"
        && this.dataAPIEndpoindDepartment.department.email == "Pass") {
        this.departmentValidate = true;
        i = department.length - 1;;
      }
    };
    //check field in each team
    var k = 0;
    for (k; k < team.length; k++) {
      team[k].id === undefined ? this.dataAPIEndpoindTeam.team.id = "Missing Field" : this.dataAPIEndpoindTeam.team.id = "Pass";
      team[k].name === undefined ? this.dataAPIEndpoindTeam.team.name = "Missing Field" : this.dataAPIEndpoindTeam.team.name = "Pass";
      team[k].email === undefined ? this.dataAPIEndpoindTeam.team.email = "Missing Field" : this.dataAPIEndpoindTeam.team.email = "Pass";
      console.log("vong for team: " + k);
      // check list members in team
      if (team[k].members.length > 0) {
        for (var i = 0; i < team[k].members.length; i++) {
          console.log("team: " + k + "member: " + i)
          if (team[k].members[i].employee_id === undefined) {
            this.dataAPIEndpoindTeam.team.member[0].id = "Missing Field";
          } else {
            this.dataAPIEndpoindTeam.team.member[0].id = "Pass";
          }
          if (team[k].members[i].employee.primary_email === undefined) {
            this.dataAPIEndpoindTeam.team.member[0].primary_email = "Missing Field";
          } else {
            this.dataAPIEndpoindTeam.team.member[0].primary_email = "Pass";
          }
          //if pass all stop members for
          if (this.dataAPIEndpoindTeam.team.member[0].id == "Pass"
            && this.dataAPIEndpoindTeam.team.member[0].primary_email == "Pass") {
            i = team[k].members.length - 1;
          }
        }
      } else {
        this.dataAPIEndpoindTeam.team.member[0].id = "Missing Field";
        this.dataAPIEndpoindTeam.team.member[0].primary_email = "Missing Field";
      }
      // if pass all stop team for
      if (this.dataAPIEndpoindTeam.team.id == "Pass" && this.dataAPIEndpoindTeam.team.name == "Pass"
        && this.dataAPIEndpoindTeam.team.email == "Pass"
        && this.dataAPIEndpoindTeam.team.member[0].id == "Pass"
        && this.dataAPIEndpoindTeam.team.member[0].primary_email == "Pass") {
        this.teamValidate = true;
        k = team.length - 1;
      }

    }
    for (var i = 0; i < position.length; i++) {
      position[i].id === undefined ? this.dataAPIEndpoindPosition.position.id = "Missing Field" : this.dataAPIEndpoindPosition.position.id = "Pass";
      position[i].name === undefined ? this.dataAPIEndpoindPosition.position.name = "Missing Field" : this.dataAPIEndpoindPosition.position.name = "Pass";
      console.log("vong for pos: " + i);
      //if pass all fields >> stop for
      if (this.dataAPIEndpoindPosition.position.id == "Pass"
        && this.dataAPIEndpoindPosition.position.name == "Pass") {
        this.positionValidate = true;
        i = position.length - 1;;
      }
    };

    if (this.employeeValidate == true && this.departmentValidate == true && this.teamValidate == true && this.positionValidate == true) {
      return true;
    } else {
      return false;
    }
  }

  checkingFormatDataConnectionString(employee, department, team, team_employee, position, vacation, length_emp, length_dep, length_team, length_position) {

    console.log(vacation);

    var empValid = false;
    var depValid = false;
    var teamValid = false;
    var positionValid = false;
    var teamEmpValid = false;
    var vacationValid = false;
    //check fields in each employee
    // for (var i = 0; i < employee.length; i++) {
    employee.id === undefined ? this.connectionStringDataResponseEmployee.employee.id = "Missing Field" : this.connectionStringDataResponseEmployee.employee.id = "Pass";
    employee.primary_email === undefined ? this.connectionStringDataResponseEmployee.employee.primary_email = "Missing Field" : this.connectionStringDataResponseEmployee.employee.primary_email = "Pass";
    employee.personal_email === undefined ? this.connectionStringDataResponseEmployee.employee.personal_email = "Missing Field" : this.connectionStringDataResponseEmployee.employee.personal_email = "Pass";
    employee.first_name === undefined ? this.connectionStringDataResponseEmployee.employee.first_name = "Missing Field" : this.connectionStringDataResponseEmployee.employee.first_name = "Pass";
    employee.last_name === undefined ? this.connectionStringDataResponseEmployee.employee.last_name = "Missing Field" : this.connectionStringDataResponseEmployee.employee.last_name = "Pass";
    employee.phone === undefined ? this.connectionStringDataResponseEmployee.employee.phone = "Missing Field" : this.connectionStringDataResponseEmployee.employee.phone = "Pass";
    employee.address === undefined ? this.connectionStringDataResponseEmployee.employee.address = "Missing Field" : this.connectionStringDataResponseEmployee.employee.address = "Pass";
    employee.department_id === undefined ? this.connectionStringDataResponseEmployee.employee.department_id = "Missing Field" : this.connectionStringDataResponseEmployee.employee.department_id = "Pass";
    employee.position_id === undefined ? this.connectionStringDataResponseEmployee.employee.position_id = "Missing Field" : this.connectionStringDataResponseEmployee.employee.position_id = "Pass";
    employee.vacation_start_date === undefined ? this.connectionStringDataResponseEmployee.employee.vacation_start_date = "Missing Field" : this.connectionStringDataResponseEmployee.employee.vacation_start_date = "Pass";
    employee.vacation_end_date === undefined ? this.connectionStringDataResponseEmployee.employee.vacation_end_date = "Missing Field" : this.connectionStringDataResponseEmployee.employee.vacation_end_date = "Pass";


    //check length
    if (length_emp.primary_email !== undefined) {
      this.connectionStringDataResponseEmployee.employee.primary_email = "Character maximum length 254"
    } else if (length_emp.personal_email !== undefined) {
      this.connectionStringDataResponseEmployee.employee.personal_email = "Character maximum length 254"
    } else if (length_emp.first_name !== undefined) {
      this.connectionStringDataResponseEmployee.employee.first_name = "Character maximum length 45"
    } else if (length_emp.last_name !== undefined) {
      this.connectionStringDataResponseEmployee.employee.last_name = "Character maximum length 45"
    } else if (length_emp.phone !== undefined) {
      this.connectionStringDataResponseEmployee.employee.phone = "Character maximum length 15"
    } else if (length_emp.address !== undefined) {
      this.connectionStringDataResponseEmployee.employee.address = "Character maximum length 512"
    }



    if (this.connectionStringDataResponseEmployee.employee.id == "Pass" && this.connectionStringDataResponseEmployee.employee.primary_email == "Pass"
      && this.connectionStringDataResponseEmployee.employee.personal_email == "Pass" && this.connectionStringDataResponseEmployee.employee.first_name == "Pass"
      && this.connectionStringDataResponseEmployee.employee.last_name == "Pass" && this.connectionStringDataResponseEmployee.employee.phone == "Pass"
      && this.connectionStringDataResponseEmployee.employee.address == "Pass" && this.connectionStringDataResponseEmployee.employee.department_id == "Pass"
      && this.connectionStringDataResponseEmployee.employee.position_id == "Pass") {
      empValid = true;
    }
    //   console.log("vong for: " + i);
    //   // if pass all field stop for 
    //   if (this.connectionStringDataResponseEmployee.employee.id == "Pass" && this.connectionStringDataResponseEmployee.employee.primary_email == "Pass"
    //     && this.connectionStringDataResponseEmployee.employee.first_name == "Pass" && this.connectionStringDataResponseEmployee.employee.last_name == "Pass"
    //     && this.connectionStringDataResponseEmployee.employee.phone == "Pass" && this.connectionStringDataResponseEmployee.employee.address == "Pass"
    //     && this.connectionStringDataResponseEmployee.employee.position_id == "Pass"
    //     && this.connectionStringDataResponseEmployee.employee.department.id == "Pass"
    //     && this.connectionStringDataResponseEmployee.employee.department.name == "Pass"
    //     && this.connectionStringDataResponseEmployee.employee.vacation_start_date == "Pass" && this.connectionStringDataResponseEmployee.employee.vacation_end_date == "Pass") {
    //     this.employeeValidate = true;
    //     i = employee.length - 1;
    //   }
    // };
    // //check field in each department
    // for (var i = 0; i < department.length; i++) {
    department.id === undefined ? this.connectionStringDataResponseDepartment.department.id = "Missing Field" : this.connectionStringDataResponseDepartment.department.id = "Pass";
    department.name === undefined ? this.connectionStringDataResponseDepartment.department.name = "Missing Field" : this.connectionStringDataResponseDepartment.department.name = "Pass";
    department.email === undefined ? this.connectionStringDataResponseDepartment.department.email = "Missing Field" : this.connectionStringDataResponseDepartment.department.email = "Pass";



    if (length_dep.name !== undefined) {
      this.connectionStringDataResponseDepartment.department.name = "Character maximum length 200"
    } else if (length_dep.email !== undefined) {
      this.connectionStringDataResponseDepartment.department.email = "Character maximum length 254"
    }

    if (this.connectionStringDataResponseDepartment.department.id == "Pass" && this.connectionStringDataResponseDepartment.department.name == "Pass"
      && this.connectionStringDataResponseDepartment.department.email == "Pass") {
      depValid = true;
    }
    //   console.log("vong for dep: " + i);
    //   //if pass all fields >> stop for
    //   if (this.connectionStringDataResponseDepartment.department.id == "Pass"
    //     && this.connectionStringDataResponseDepartment.department.name == "Pass" && this.connectionStringDataResponseDepartment.department.email == "Pass") {
    //     this.departmentValidate = true;
    //     i = department.length - 1;;
    //   }
    // };
    // //check field in each team
    // var k = 0;
    // for (k; k < team.length; k++) {
    team.id === undefined ? this.connectionStringDataResponseTeam.team.id = "Missing Field" : this.connectionStringDataResponseTeam.team.id = "Pass";
    team.name === undefined ? this.connectionStringDataResponseTeam.team.name = "Missing Field" : this.connectionStringDataResponseTeam.team.name = "Pass";
    team.email === undefined ? this.connectionStringDataResponseTeam.team.email = "Missing Field" : this.connectionStringDataResponseTeam.team.email = "Pass";


    if (length_team.name !== undefined) {
      this.connectionStringDataResponseTeam.team.name = "Character maximum length 200"
    } else if (length_team.email !== undefined) {
      this.connectionStringDataResponseTeam.team.email = "Character maximum length 254"
    }



    if (this.connectionStringDataResponseTeam.team.id == "Pass" && this.connectionStringDataResponseTeam.team.name == "Pass" && this.connectionStringDataResponseTeam.team.email == "Pass") {
      teamValid = true;
    }

    team_employee.employee_id === undefined ? this.connectionStringDataResponseTeamEmployee.team_employee.employee_id = "Missing Field" : this.connectionStringDataResponseTeamEmployee.team_employee.employee_id = "Pass";
    team_employee.team_id === undefined ? this.connectionStringDataResponseTeamEmployee.team_employee.team_id = "Missing Field" : this.connectionStringDataResponseTeamEmployee.team_employee.team_id = "Pass";

    if (this.connectionStringDataResponseTeamEmployee.team_employee.employee_id == "Pass" && this.connectionStringDataResponseTeamEmployee.team_employee.team_id == "Pass") {
      teamEmpValid = true;
    }
    //   console.log("vong for team: " + k);
    //   // check list members in team
    //   if (team[k].members.length > 0) {
    //     for (var i = 0; i < team[k].members.length; i++) {
    //       console.log("team: " + k + "member: " + i)
    //       if (team[k].members[i].employee_id === undefined) {
    //         this.connectionStringDataResponseTeam.team.member[0].id = "Missing Field";
    //       } else {
    //         this.connectionStringDataResponseTeam.team.member[0].id = "Pass";
    //       }
    //       if (team[k].members[i].employee.primary_email === undefined) {
    //         this.connectionStringDataResponseTeam.team.member[0].primary_email = "Missing Field";
    //       } else {
    //         this.connectionStringDataResponseTeam.team.member[0].primary_email = "Pass";
    //       }
    //       //if pass all stop members for
    //       if (this.connectionStringDataResponseTeam.team.member[0].id == "Pass"
    //         && this.connectionStringDataResponseTeam.team.member[0].primary_email == "Pass") {
    //         i = team[k].members.length - 1;
    //       }
    //     }
    //   } else {
    //     this.connectionStringDataResponseTeam.team.member[0].id = "Missing Field";
    //     this.connectionStringDataResponseTeam.team.member[0].primary_email = "Missing Field";
    //   }
    //   // if pass all stop team for
    //   if (this.connectionStringDataResponseTeam.team.id == "Pass" && this.connectionStringDataResponseTeam.team.name == "Pass"
    //     && this.connectionStringDataResponseTeam.team.email == "Pass"
    //     && this.connectionStringDataResponseTeam.team.member[0].id == "Pass"
    //     && this.connectionStringDataResponseTeam.team.member[0].primary_email == "Pass") {
    //     this.teamValidate = true;
    //     k = team.length - 1;
    //   }

    // }

    // //check field in each position
    // for (var i = 0; i < position.length; i++) {
    position.id === undefined ? this.connectionStringDataResponsePositon.position.id = "Missing Field" : this.connectionStringDataResponsePositon.position.id = "Pass";
    position.name === undefined ? this.connectionStringDataResponsePositon.position.name = "Missing Field" : this.connectionStringDataResponsePositon.position.name = "Pass";


    if (length_position.name !== undefined) {
      this.connectionStringDataResponsePositon.position.name = "Character maximum length 200"
    }

    if (this.connectionStringDataResponsePositon.position.name == "Pass" && this.connectionStringDataResponsePositon.position.id == "Pass") {
      positionValid = true;
    }
    //   console.log("vong for pos: " + i);
    //   //if pass all fields >> stop for
    //   if (this.connectionStringDataResponsePositon.position.id == "Pass"
    //     && this.connectionStringDataResponsePositon.position.name == "Pass") {
    //     this.positionValidate = true;
    //     i = position.length - 1;;
    //   }
    // };

    // if (this.employeeValidate == true && this.departmentValidate == true && this.teamValidate == true && this.positionValidate == true) {
    //   return true;
    // } else {
    //   return false;
    // }
    vacation.employee_id === undefined ? this.connectionStringDataResponseVacation.vacation.employee_id = "Missing Field" : this.connectionStringDataResponseVacation.vacation.employee_id = "Pass";
    vacation.start_date === undefined ? this.connectionStringDataResponseVacation.vacation.start_date = "Missing Field" : this.connectionStringDataResponseVacation.vacation.start_date = "Pass";
    vacation.end_date === undefined ? this.connectionStringDataResponseVacation.vacation.end_date = "Missing Field" : this.connectionStringDataResponseVacation.vacation.end_date = "Pass";

    if (this.connectionStringDataResponseVacation.vacation.employee_id == "Pass" && this.connectionStringDataResponseVacation.vacation.end_date == "Pass" && this.connectionStringDataResponseVacation.vacation.start_date == "Pass") {
      vacationValid = true;
    }
    console.log(empValid, depValid, teamValid, teamEmpValid, positionValid, vacationValid);


    if (empValid == true && depValid == true && teamValid == true && teamEmpValid == true && positionValid == true && vacationValid == true) {
      return true;
    } else {
      return false;
    }

  }


  chooseTable: any = [];
  chooseField = [];
  fieldNameList = [];
  checkChangeSelectTable = [];
  fieldChang(event, z) {
    if (this.mappingTableResult[z].tableHR.nametableHR != this.checkChangeSelectTable[z]) {
      console.log(this.mappingTableResult);

      if (z == 0) {
        console.log("0");
        for (let k = 0; k < this.tableMappingModel[0].fields.length; k++) {
          this.tableMappingModel[0].fields[k].status = "Not mapping yet";
          this.mappingTableResult[0].tableHR.fields[k] = "";

        }
        console.log(this.mappingTableResult);
      }
      if (z == 1) {
        console.log("1");
        for (let k = 0; k < this.tableMappingModel[1].fields.length; k++) {
          this.tableMappingModel[1].fields[k].status = "Not mapping yet";
          this.mappingTableResult[1].tableHR.fields[k] = "";
        }

      }
      if (z == 2) {
        console.log("2");
        for (let k = 0; k < this.tableMappingModel[2].fields.length; k++) {
          this.tableMappingModel[2].fields[k].status = "Not mapping yet";
          this.mappingTableResult[2].tableHR.fields[k] = "";
        }
      }
      if (z == 3) {
        console.log("3");
        for (let k = 0; k < this.tableMappingModel[3].fields.length; k++) {
          this.tableMappingModel[3].fields[k].status = "Not mapping yet"
        }
      }
      if (z == 4) {
        console.log("4");
        for (let k = 0; k < this.tableMappingModel[4].fields.length; k++) {
          this.tableMappingModel[4].fields[k].status = "Not mapping yet";
          this.mappingTableResult[4].tableHR.fields[k] = "";
        }
      }
      if (z == 5) {
        console.log("5");
        for (let k = 0; k < this.tableMappingModel[5].fields.length; k++) {
          this.tableMappingModel[5].fields[k].status = "Not mapping yet";
          this.mappingTableResult[5].tableHR.fields[k] = "";
        }
      }
    }
    console.log(this.table);
    for (let i = 0; i < this.table.length; i++) {
      if (this.mappingTableResult[z].tableHR.nametableHR == this.table[i].tableName) {
        this.chooseTable[z] = this.table[i].tableName + "-" + z;
        this.chooseField[z] = this.table[i].tableName + "-" + z;
        this.fieldNameList[z] = [];
        this.table[i].fields.forEach(element => {
          this.fieldNameList[z].push(element.name);
        });
        // this.mappingTableResult[z].tableHR.nametableHR = name;
      };
    }
    this.checkChangeSelectTable[z] = this.mappingTableResult[z].tableHR.nametableHR;
    console.log(this.fieldNameList);

    this.checkingMapping();

  }

  selectFiledChange(event, z, j) {
    this.mappingTableResult[z].tableHR.fields[j] = this.mappingTableResult[z].tableHR.fields[j];
    if (z == 0) {
      this.checkingLengthEmployee(this.mappingTableResult);
    } else if (z == 1) {
      this.checkingLengthDepartment(this.mappingTableResult);

    } else if (z == 2) {
      this.checkingLengthTeam(this.mappingTableResult);
    } else if (z == 3) {
      this.checkingLengthTeamEmployee(this.mappingTableResult);
    } else if (z == 4) {
      this.checkingLengthposition(this.mappingTableResult);
    } else if (z == 5) {
      this.checkingLengthVacation(this.mappingTableResult);
    }
    this.checkingMapping();

  }
  // test connection string
  connectionStringResultEmployee;
  connectionStringResultTeam;
  connectionStringResultDepartment;
  connectionStringResultTeamEmployee
  connectionStringResultPosition;
  connectionStringResultVacation;
  table: any;
  onTestConection(modal, value) {
    this.loadingFull = true;
    this.loadingTestConnection = true;
    this.companyConnection = new CompanyConnection();
    this.companyConnection.dbName = value.dbName;
    this.companyConnection.host = value.host;
    this.companyConnection.port = value.port;
    this.companyConnection.username = value.username;
    this.companyConnection.password = value.password;
    this.companyConnection.dialect = value.dialect;
    this.enableDataConnectionResult = false;
    this.connectionFail = false;
    this.disableSaveConnectionStringButton = false;
    console.log(this.companyConnection);
    this.companyConnectionService.testDBCompanyConnection(this.companyConnection).subscribe(
      (res: any) => {
        // const result: any = res;
        console.log(this.mappingTableResult);
        this.loadingFull = false;
        this.table = [];
        if (res.checkConnection != undefined) {
          if (res.checkConnection.status == "success") {
            this.connectionStatus.connection.status = "Success";
            this.connectionStatus.connection.message = "Connect successfully";
            this.loadingTestConnection = false;
            this.connectionStringResultEmployee = res.employees;
            this.connectionStringResultDepartment = res.departments;
            this.connectionStringResultTeam = res.teams
            this.connectionStringResultTeamEmployee = res.team_employee;
            this.connectionStringResultPosition = res.positions;
            this.connectionStringResultVacation = res.vacation_date;
            this.table = res.table;
            console.log(this.table);

            var check = this.checkingFormatDataConnectionString(
              this.connectionStringResultEmployee,
              this.connectionStringResultDepartment,
              this.connectionStringResultTeam,
              this.connectionStringResultTeamEmployee,
              this.connectionStringResultPosition,
              this.connectionStringResultVacation,
              res.character_maximum_length_employee,
              res.character_maximum_length_department,
              res.character_maximum_length_team,
              res.character_maximum_length_position);
            // let item = [];
            // let item1 = [];
            // let item2 = []
            // this.tableMappingModel.forEach((element, i) => {
            //   item = [];
            //   item1 = []
            //   item2 = []
            //   element.fields.forEach((el, j) => {
            //     item.push(j);
            //     item2.push("null");
            //   });
            //   this.chooseTable[i] = item;
            //   this.chooseField[i] = item2;
            // });
            this.getMappingConfig();
            this.enableDataConnectionResult = true;
            this.connectionFail = false;
            console.log(check);

            this.disableSaveConnectionStringButton = check;
            this.loadingFull = false;
            console.log(this.fieldNameList);
            this.modalService.open(modal, { size: 'xl', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
          } if (res.checkConnection.status == "fail" || res.status == 0) {
            this.connectionStatus.connection.status = "Fail";
            this.connectionStatus.connection.message = res.checkConnection.message;
            this.disableSaveConnectionStringButton = false;
            this.employeeValidate = false;
            this.teamValidate = false;
            this.departmentValidate = false;
            this.connectionStringDataResponseEmployee.employee.id = "Required";
            this.connectionStringDataResponseEmployee.employee.primary_email = "Required";
            this.connectionStringDataResponseEmployee.employee.personal_email = "Required";
            this.connectionStringDataResponseEmployee.employee.first_name = "Required";
            this.connectionStringDataResponseEmployee.employee.last_name = "Required";
            this.connectionStringDataResponseEmployee.employee.phone = "Required";
            this.connectionStringDataResponseEmployee.employee.address = "Required";
            this.connectionStringDataResponseEmployee.employee.vacation_start_date = "Required";
            this.connectionStringDataResponseEmployee.employee.vacation_end_date = "Required";
            this.connectionStringDataResponseEmployee.employee.department_id = "Required";
            this.connectionStringDataResponseEmployee.employee.position_id = "Required";
            this.connectionStringDataResponseDepartment.department.id = "Required";
            this.connectionStringDataResponseDepartment.department.name = "Required";
            this.connectionStringDataResponseDepartment.department.email = "Required";
            this.connectionStringDataResponseTeam.team.id = "Required";
            this.connectionStringDataResponseTeam.team.name = "Required";
            this.connectionStringDataResponseTeam.team.email = "Required";
            this.connectionStringDataResponseTeamEmployee.team_employee.employee_id = "Required";
            this.connectionStringDataResponseTeamEmployee.team_employee.team_id = "Required";
            this.connectionStringDataResponsePositon.position.id = "Required";
            this.connectionStringDataResponsePositon.position.name = "Required";
            this.connectionStringDataResponseVacation.vacation.end_date = "Required";
            this.connectionStringDataResponseVacation.vacation.employee_id = "Required";
            this.connectionStringDataResponseVacation.vacation.start_date = "Required";
            this.setMappingResultConnectionFail();
            this.enableDataConnectionResult = true;
            this.connectionFail = true;
            this.loadingTestConnection = false;
            this.loadingFull = false;
            this.modalService.open(modal, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
          }
        } else {
          this.loadingFull = false;
          this.loadingTestConnection = false;
          console.log(res);
        }

      },
      (error) => {
        console.log(error);
        this.loadingFull = false;
        this.loadingTestConnection = false;
        this.toast.error("Server is not available!");
      }
    )
  }

  //get mapping configuration
  getMappingConfig() {
    var accountId = localStorage.getItem("id")
    this.accountServices.getMappingConfig(accountId).subscribe(
      (res: any) => {
        var result = res;
        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            this.mappingTableResult[i].tableHR.nametableHR = result[i].tableName
            for (let j = 0; j < result[i].field.length; j++) {
              this.mappingTableResult[i].tableHR.fields[j] = result[i].field[j]
            }
          }

          var index = 0
          while (index < this.mappingTableResult.length) {
            for (let i = 0; i < this.table.length; i++) {
              if (this.mappingTableResult[index].tableHR.nametableHR == this.table[i].tableName) {
                this.fieldNameList[index] = [];
                for (let j = 0; j < this.table[i].fields.length; j++) {

                  console.log(this.table[i].fields[j].name);

                  this.fieldNameList[index].push(this.table[i].fields[j].name);
                }
                index = index + 1;
              }
            }
          }
          for (let i = 0; i < this.tableMappingModel.length; i++) {
            for (let j = 0; j < this.tableMappingModel[i].fields.length; j++) {
              this.tableMappingModel[i].fields[j].status = "Mapped";
            }
          }
          this.enableButtonSaveMapping = false;
        } else {
          for (let i = 0; i < this.tableMappingModel.length; i++) {
            for (let j = 0; j < this.tableMappingModel[i].fields.length; j++) {
              this.tableMappingModel[i].fields[j].status = "Not mapping yet";
            }
          }
          this.enableButtonSaveMapping = true;
        }


      },
      (err) => {
        console.log(err);
        this.toast.error("Server is not available!");
      }
    )
  }

  //set data mapping result when connection fail
  setMappingResultConnectionFail() {
    for (let i = 0; i < this.mappingTableResult.length; i++) {
      this.mappingTableResult[i].tableHR.nametableHR = "";
      for (let j = 0; j < this.mappingTableResult[i].tableHR.fields.length; j++) {
        this.mappingTableResult[i].tableHR.fields[j] = "";
        this.tableMappingModel[i].fields[j].status = "Not mapping yet";
      }
    }
  }

  // save connection string
  onSubmitConection(value) {
    this.connection_method = 'Database mapping automatically'
    this.loadingFull = true;
    this.companyConnection = new CompanyConnection();
    this.companyConnection.dbName = value.dbName;
    this.companyConnection.host = value.host;
    this.companyConnection.port = value.port;
    this.companyConnection.username = value.username;
    this.companyConnection.password = value.password;
    this.companyConnection.dialect = value.dialect;
    const connectionString = this.companyConnection.dbName + " " + this.companyConnection.host + " " + this.companyConnection.port + " " + this.companyConnection.username + " " +
      this.companyConnection.password + " " + this.companyConnection.dialect;
    const connectionString_valid = "http://localhost:3002/api/api-endpoint?dbName=" + this.companyConnection.dbName +
      "&host=" + this.companyConnection.host + "&port=" + this.companyConnection.port + "&username=" + this.companyConnection.username +
      "&password=" + this.companyConnection.password + "&dialect=" + this.companyConnection.dialect
    const id = localStorage.getItem('id');
    this.account = new AccountCompanyModel;
    this.account.id = id;
    this.account.connection_valid = connectionString_valid;
    this.account.connection_database = connectionString;
    // this.account.api_endpoint = api_enpoint;
    console.log(this.account);

    this.companyServices.updateAccountCompany(this.account).subscribe(
      (res: any) => {
        if (res.status == "success") {
          this.loadingFull = false;
          this.toast.success("Save connection database successfully!");
          this.nextButonConditonConnectionString = true;
          this.closeModal();
        };
        if (res.code == "fail") {
          this.loadingFull = false;
          this.toast.error("Save connection database fail!");
          this.nextButonConditonConnectionString = false;
        }
      },
      (error) => {
        this.loadingFull = false;
        this.toast.error("Server is not available!");
        this.nextButonConditonConnectionString = false;
      }
    )
  }

  enableButtonSaveMapping = true;
  onSubmitConectionMapping(value) {
    this.connection_method = 'Database mapping manually'
    this.loadingFull = true;
    this.enableButtonSaveMapping = true;
    this.loadingSaveMapping = true;
    this.companyConnection = new CompanyConnection();
    this.companyConnection.dbName = value.dbName;
    this.companyConnection.host = value.host;
    this.companyConnection.port = value.port;
    this.companyConnection.username = value.username;
    this.companyConnection.password = value.password;
    this.companyConnection.dialect = value.dialect;




    const id = localStorage.getItem('id');
    this.account = new AccountCompanyModel;
    this.account.id = id;
    var req = {
      accountId: this.account.id,
      mapping: this.mappingTableResult,
      dbInfor: this.companyConnection
    }
    console.log(req);
    this.companyConnectionService.saveDBMappingConnection(req).subscribe(
      (res: any) => {
        this.enableButtonSaveMapping = false;
        this.loadingSaveMapping = false;
        if (res.code == 200) {
          this.loadingFull = false;
          this.toast.success(res.status);
          this.nextButonConditonConnectionString = true;
          this.closeModal();
        };
        if (res.code == 500) {
          this.enableButtonSaveMapping = false;
          this.loadingSaveMapping = false;
          this.toast.error(res.status);
          this.nextButonConditonConnectionString = false;
        }
      },
      (error) => {
        this.loadingFull = false;
        this.enableButtonSaveMapping = false;
        this.loadingSaveMapping = false;
        this.toast.error("Server is not available!");
        this.nextButonConditonConnectionString = false;
      }
    )
  }

  checkingMapping() {
    // for (let i = 0; i < mappingResult.length; i++) {
    //   if (mappingResult[i].tableHR.nametableHR == "") {
    //     this.enableButtonSaveMapping = true;
    //   } else {
    //     if (i == 0) {
    //       if (mappingResult[i].tableHR.fields[0] !== "" &&
    //         mappingResult[i].tableHR.fields[1] !== "" && mappingResult[i].tableHR.fields[2] !== ""
    //         && mappingResult[i].tableHR.fields[3] !== "" && mappingResult[i].tableHR.fields[4] !== ""
    //         && mappingResult[i].tableHR.fields[5] !== "" && mappingResult[i].tableHR.fields[6] !== ""
    //         && mappingResult[i].tableHR.fields[7] !== "" && mappingResult[i].tableHR.fields[8] !== "") {
    //         this.enableButtonSaveMapping = false;
    //       }
    //       else {
    //         this.enableButtonSaveMapping = true;
    //       }
    //     }
    //     if (i == 1) {
    //       if (mappingResult[i].tableHR.fields[0].id !== "" &&
    //         mappingResult[i].tableHR.fields[1].name !== "" && mappingResult[i].tableHR.fields[2].email !== ""
    //       ) {
    //         this.enableButtonSaveMapping = false;
    //       }
    //       else {
    //         this.enableButtonSaveMapping = true;
    //       }
    //     }
    //     if (i == 2) {
    //       if (mappingResult[i].tableHR.fields[0].id !== "" &&
    //         mappingResult[i].tableHR.fields[1].name !== "" && mappingResult[i].tableHR.fields[2].email !== ""
    //       ) {
    //         this.enableButtonSaveMapping = false;
    //       }
    //       else {
    //         this.enableButtonSaveMapping = true;
    //       }
    //     }
    //     if (i == 3) {
    //       if (mappingResult[i].tableHR.fields[0].employee_id !== "" && mappingResult[i].tableHR.fields[1].team_id !== "") {
    //         this.enableButtonSaveMapping = false;
    //       }
    //       else {
    //         this.enableButtonSaveMapping = true;
    //       }
    //     }
    //     if (i == 4) {
    //       if (mappingResult[i].tableHR.fields[0].id !== "" && mappingResult[i].tableHR.fields[1].name !== "") {
    //         this.enableButtonSaveMapping = false;
    //       }
    //       else {
    //         this.enableButtonSaveMapping = true;
    //       }
    //     }
    //     if (i == 5) {
    //       if (mappingResult[i].tableHR.fields[0].employee_id !== "" &&
    //         mappingResult[i].tableHR.fields[1].start_date !== "" && mappingResult[i].tableHR.fields[2].end_date !== ""
    //       ) {
    //         this.enableButtonSaveMapping = false;
    //       }
    //       else {
    //         this.enableButtonSaveMapping = true;
    //       }
    //     }
    //   }
    // }
    var check = []
    for (let i = 0; i < this.tableMappingModel.length; i++) {
      for (let j = 0; j < this.tableMappingModel[i].fields.length; j++) {
        if (this.tableMappingModel[i].fields[j].status != "Mapped") {
          check.push(this.tableMappingModel[i].fields[j].status);
        }
      }
    }
    if (check.length > 0) {
      this.enableButtonSaveMapping = true
    } else {
      this.enableButtonSaveMapping = false
    }
  }
  // check length emp mapping database
  checkingLengthEmployee(mappingResult) {
    // id emp
    if (mappingResult[0].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[0].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[0].tableHR.fields[0] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[0].tableHR.fields[0] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);
                // if (this.table[i].fields[j].length !== null && this.table[i].fields[j].length > 15) {
                //   this.tableMappingModel[0].fields[0].status = "Max character length must to < 15";
                // }
                // else if (this.table[i].fields[j].length === null) {
                this.tableMappingModel[0].fields[0].status = "Mapped";
                // } else {
                //   this.tableMappingModel[0].fields[0].status = "Max character length must to < 254"
                // }
              }
            }
          } else {
            this.tableMappingModel[0].fields[0].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[0].fields[0].status = "Not mapping yet";
    }
    //check primary emp
    if (mappingResult[0].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[0].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[0].tableHR.fields[1] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[0].tableHR.fields[1] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);

                if (this.table[i].fields[j].length !== null && this.table[i].fields[j].length <= 254) {
                  this.tableMappingModel[0].fields[1].status = "Mapped";
                  console.log(this.tableMappingModel);

                } else if (this.table[i].fields[j].length === null) {
                  this.tableMappingModel[0].fields[1].status = "Mapped";
                } else {
                  this.tableMappingModel[0].fields[1].status = "Max character length must to < 254"
                }
              }
            }
          } else {
            this.tableMappingModel[0].fields[1].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[0].fields[1].status = "Not mapping yet";
    }
    //check personal emp
    if (mappingResult[0].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[0].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[0].tableHR.fields[2] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[0].tableHR.fields[2] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);

                if (this.table[i].fields[j].length !== null && this.table[i].fields[j].length <= 254) {
                  this.tableMappingModel[0].fields[2].status = "Mapped";
                  console.log(this.tableMappingModel);

                } else if (this.table[i].fields[j].length === null) {
                  this.tableMappingModel[0].fields[2].status = "Mapped";
                } else {
                  this.tableMappingModel[0].fields[2].status = "Max character length must to < 254"
                }
              }
            }
          } else {
            this.tableMappingModel[0].fields[2].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[0].fields[2].status = "Not mapping yet";
    }

    //check first name emp
    if (mappingResult[0].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[0].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[0].tableHR.fields[3] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[0].tableHR.fields[3] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);

                if (this.table[i].fields[j].length !== null && this.table[i].fields[j].length <= 45) {
                  this.tableMappingModel[0].fields[3].status = "Mapped";
                  console.log(this.tableMappingModel);

                } else if (this.table[i].fields[j].length === null) {
                  this.tableMappingModel[0].fields[3].status = "Mapped";
                } else {
                  this.tableMappingModel[0].fields[3].status = "Max character length must to < 45"
                }
              }
            }
          } else {
            this.tableMappingModel[0].fields[3].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[0].fields[3].status = "Not mapping yet";
    }

    //check last name emp
    if (mappingResult[0].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[0].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[0].tableHR.fields[4] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[0].tableHR.fields[4] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);

                if (this.table[i].fields[j].length !== null && this.table[i].fields[j].length <= 45) {
                  this.tableMappingModel[0].fields[4].status = "Mapped";
                  console.log(this.tableMappingModel);

                } else if (this.table[i].fields[j].length === null) {
                  this.tableMappingModel[0].fields[4].status = "Mapped";
                } else {
                  this.tableMappingModel[0].fields[4].status = "Max character length must to < 45"
                }
              }
            }
          } else {
            this.tableMappingModel[0].fields[4].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[0].fields[4].status = "Not mapping yet";
    }

    //check phone  emp
    if (mappingResult[0].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[0].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[0].tableHR.fields[5] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[0].tableHR.fields[5] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);

                if (this.table[i].fields[j].length !== null && this.table[i].fields[j].length <= 45) {
                  this.tableMappingModel[0].fields[5].status = "Mapped";
                  console.log(this.tableMappingModel);

                } else if (this.table[i].fields[j].length === null) {
                  this.tableMappingModel[0].fields[5].status = "Mapped";
                } else {
                  this.tableMappingModel[0].fields[5].status = "Max character length must to < 15"
                }
              }
            }
          } else {
            this.tableMappingModel[0].fields[5].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[0].fields[5].status = "Not mapping yet";
    }

    //check address  emp
    if (mappingResult[0].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[0].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[0].tableHR.fields[6] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[0].tableHR.fields[6] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);

                if (this.table[i].fields[j].length !== null && this.table[i].fields[j].length <= 512) {
                  this.tableMappingModel[0].fields[6].status = "Mapped";
                  console.log(this.tableMappingModel);

                } else if (this.table[i].fields[j].length === null) {
                  this.tableMappingModel[0].fields[6].status = "Mapped";
                } else {
                  this.tableMappingModel[0].fields[6].status = "Max character length must to < 512"
                }
              }
            }
          } else {
            this.tableMappingModel[0].fields[6].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[0].fields[6].status = "Not mapping yet";
    }

    // department id emp
    if (mappingResult[0].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[0].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[0].tableHR.fields[7] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[0].tableHR.fields[7] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);
                // if (this.table[i].fields[j].length !== null && this.table[i].fields[j].length > 15) {
                //   this.tableMappingModel[0].fields[0].status = "Max character length must to < 15";
                // }
                // else if (this.table[i].fields[j].length === null) {
                this.tableMappingModel[0].fields[7].status = "Mapped";
                // } else {
                //   this.tableMappingModel[0].fields[0].status = "Max character length must to < 254"
                // }
              }
            }
          } else {
            this.tableMappingModel[0].fields[7].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[0].fields[7].status = "Not mapping yet";
    }

    // position id emp
    if (mappingResult[0].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[0].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[0].tableHR.fields[8] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[0].tableHR.fields[8] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);
                // if (this.table[i].fields[j].length !== null && this.table[i].fields[j].length > 15) {
                //   this.tableMappingModel[0].fields[0].status = "Max character length must to < 15";
                // }
                // else if (this.table[i].fields[j].length === null) {
                this.tableMappingModel[0].fields[8].status = "Mapped";
                // } else {
                //   this.tableMappingModel[0].fields[0].status = "Max character length must to < 254"
                // }
              }
            }
          } else {
            this.tableMappingModel[0].fields[8].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[0].fields[8].status = "Not mapping yet";
    }
    // for (let i = 0; i < this.mappingTableResult.length; i++) {
    //   for (let j = 0; j < this.mappingTableResult[i].tableHR.fields.length; j++) {
    //     if (this.mappingTableResult[i].tableHR.fields[j] === "") {
    //       this.tableMappingModel[i].fields[j].status = "Not mapping yet"
    //     } else {
    //       this.tableMappingModel[i].fields[j].status = "Mapped";
    //     }
    //   }
    // }

  }

  //check length department mapping database
  checkingLengthDepartment(mappingResult) {

    // id department
    if (mappingResult[1].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[1].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[1].tableHR.fields[0] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[1].tableHR.fields[0] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);
                // if (this.table[i].fields[j].length !== null && this.table[i].fields[j].length > 15) {
                //   this.tableMappingModel[0].fields[0].status = "Max character length must to < 15";
                // }
                // else if (this.table[i].fields[j].length === null) {
                this.tableMappingModel[1].fields[0].status = "Mapped";
                // } else {
                //   this.tableMappingModel[0].fields[0].status = "Max character length must to < 254"
                // }
              }
            }
          } else {
            this.tableMappingModel[1].fields[0].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[1].fields[0].status = "Not mapping yet";
    }

    // name department
    if (mappingResult[1].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[1].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[1].tableHR.fields[1] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[1].tableHR.fields[1] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);

                if (this.table[i].fields[j].length !== null && this.table[i].fields[j].length <= 200) {
                  this.tableMappingModel[1].fields[1].status = "Mapped";
                  console.log(this.tableMappingModel);

                } else if (this.table[i].fields[j].length === null) {
                  this.tableMappingModel[1].fields[1].status = "Mapped";
                } else {
                  this.tableMappingModel[1].fields[1].status = "Max character length must to < 200"
                }
              }
            }
          } else {
            this.tableMappingModel[1].fields[1].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[1].fields[1].status = "Not mapping yet";
    }

    // email department
    if (mappingResult[1].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[1].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[1].tableHR.fields[2] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[1].tableHR.fields[2] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);

                if (this.table[i].fields[j].length !== null && this.table[i].fields[j].length <= 254) {
                  this.tableMappingModel[1].fields[2].status = "Mapped";
                  console.log(this.tableMappingModel);

                } else if (this.table[i].fields[j].length === null) {
                  this.tableMappingModel[1].fields[2].status = "Mapped";
                } else {
                  this.tableMappingModel[1].fields[2].status = "Max character length must to < 254"
                }
              }
            }
          } else {
            this.tableMappingModel[1].fields[2].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[1].fields[2].status = "Not mapping yet";
    }
  }

  // check length team mapping database
  checkingLengthTeam(mappingResult) {

    // id team
    if (mappingResult[2].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[2].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[2].tableHR.fields[0] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[2].tableHR.fields[0] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);
                // if (this.table[i].fields[j].length !== null && this.table[i].fields[j].length > 15) {
                //   this.tableMappingModel[0].fields[0].status = "Max character length must to < 15";
                // }
                // else if (this.table[i].fields[j].length === null) {
                this.tableMappingModel[2].fields[0].status = "Mapped";
                // } else {
                //   this.tableMappingModel[0].fields[0].status = "Max character length must to < 254"
                // }
              }
            }
          } else {
            this.tableMappingModel[2].fields[0].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[2].fields[0].status = "Not mapping yet";
    }

    // name team
    if (mappingResult[1].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[2].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[2].tableHR.fields[1] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[2].tableHR.fields[1] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);

                if (this.table[i].fields[j].length !== null && this.table[i].fields[j].length <= 200) {
                  this.tableMappingModel[2].fields[1].status = "Mapped";
                  console.log(this.tableMappingModel);

                } else if (this.table[i].fields[j].length === null) {
                  this.tableMappingModel[2].fields[1].status = "Mapped";
                } else {
                  this.tableMappingModel[2].fields[1].status = "Max character length must to < 200"
                }
              }
            }
          } else {
            this.tableMappingModel[2].fields[1].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[2].fields[1].status = "Not mapping yet";
    }

    // email team
    if (mappingResult[1].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[2].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[2].tableHR.fields[2] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[2].tableHR.fields[2] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);

                if (this.table[i].fields[j].length !== null && this.table[i].fields[j].length <= 254) {
                  this.tableMappingModel[2].fields[2].status = "Mapped";
                  console.log(this.tableMappingModel);

                } else if (this.table[i].fields[j].length === null) {
                  this.tableMappingModel[2].fields[2].status = "Mapped";
                } else {
                  this.tableMappingModel[2].fields[2].status = "Max character length must to < 254"
                }
              }
            }
          } else {
            this.tableMappingModel[2].fields[2].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[2].fields[2].status = "Not mapping yet";
    }
  }

  //check length team_employee mapping database
  checkingLengthTeamEmployee(mappingResult) {
    // employee_id team
    if (mappingResult[3].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[3].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[3].tableHR.fields[0] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[3].tableHR.fields[0] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);
                // if (this.table[i].fields[j].length !== null && this.table[i].fields[j].length > 15) {
                //   this.tableMappingModel[0].fields[0].status = "Max character length must to < 15";
                // }
                // else if (this.table[i].fields[j].length === null) {
                this.tableMappingModel[3].fields[0].status = "Mapped";
                // } else {
                //   this.tableMappingModel[0].fields[0].status = "Max character length must to < 254"
                // }
              }
            }
          } else {
            this.tableMappingModel[3].fields[0].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[3].fields[0].status = "Not mapping yet";
    }

    // team_id team
    if (mappingResult[3].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[3].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[3].tableHR.fields[1] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[3].tableHR.fields[1] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);
                // if (this.table[i].fields[j].length !== null && this.table[i].fields[j].length > 15) {
                //   this.tableMappingModel[0].fields[0].status = "Max character length must to < 15";
                // }
                // else if (this.table[i].fields[j].length === null) {
                this.tableMappingModel[3].fields[1].status = "Mapped";
                // } else {
                //   this.tableMappingModel[0].fields[0].status = "Max character length must to < 254"
                // }
              }
            }
          } else {
            this.tableMappingModel[3].fields[1].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[3].fields[1].status = "Not mapping yet";
    }
  }

  //check length position mapping database
  checkingLengthposition(mappingResult) {
    // employee_id team
    if (mappingResult[4].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[4].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[4].tableHR.fields[0] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[4].tableHR.fields[0] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);
                // if (this.table[i].fields[j].length !== null && this.table[i].fields[j].length > 15) {
                //   this.tableMappingModel[0].fields[0].status = "Max character length must to < 15";
                // }
                // else if (this.table[i].fields[j].length === null) {
                this.tableMappingModel[4].fields[0].status = "Mapped";
                // } else {
                //   this.tableMappingModel[0].fields[0].status = "Max character length must to < 254"
                // }
              }
            }
          } else {
            this.tableMappingModel[4].fields[0].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[4].fields[0].status = "Not mapping yet";
    }

    // name team
    if (mappingResult[4].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[4].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[4].tableHR.fields[1] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[4].tableHR.fields[1] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);

                if (this.table[i].fields[j].length !== null && this.table[i].fields[j].length <= 45) {
                  this.tableMappingModel[4].fields[1].status = "Mapped";
                  console.log(this.tableMappingModel);

                } else if (this.table[i].fields[j].length === null) {
                  this.tableMappingModel[4].fields[1].status = "Mapped";
                } else {
                  this.tableMappingModel[4].fields[1].status = "Max character length must to < 45"
                }
              }
            }
          } else {
            this.tableMappingModel[4].fields[1].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[4].fields[1].status = "Not mapping yet";
    }
  }

  checkingLengthVacation(mappingResult) {
    if (mappingResult[4].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[5].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[5].tableHR.fields[0] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[5].tableHR.fields[0] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);
                // if (this.table[i].fields[j].length !== null && this.table[i].fields[j].length > 15) {
                //   this.tableMappingModel[0].fields[0].status = "Max character length must to < 15";
                // }
                // else if (this.table[i].fields[j].length === null) {
                this.tableMappingModel[5].fields[0].status = "Mapped";
                // } else {
                //   this.tableMappingModel[0].fields[0].status = "Max character length must to < 254"
                // }
              }
            }
          } else {
            this.tableMappingModel[5].fields[0].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[5].fields[0].status = "Not mapping yet";
    }
    // employee_id team
    if (mappingResult[5].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[5].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[5].tableHR.fields[1] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[5].tableHR.fields[1] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);
                if (this.table[i].fields[j].type === "datetime") {
                  this.tableMappingModel[5].fields[1].status = "Mapped";
                  console.log(this.tableMappingModel);

                } else {
                  this.tableMappingModel[5].fields[1].status = "Type must be datetime"
                }
              }
            }
          } else {
            this.tableMappingModel[5].fields[1].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[5].fields[1].status = "Not mapping yet";
    }

    // name team
    if (mappingResult[5].tableHR.nametableHR != "") {
      for (let i = 0; i < this.table.length; i++) {
        if (mappingResult[5].tableHR.nametableHR == this.table[i].tableName) {
          if (mappingResult[5].tableHR.fields[2] != "") {

            for (let j = 0; j < this.table[i].fields.length; j++) {
              if (mappingResult[5].tableHR.fields[2] == this.table[i].fields[j].name) {
                console.log(this.table[i].fields[j].length);

                if (this.table[i].fields[j].type === "datetime") {
                  this.tableMappingModel[5].fields[2].status = "Mapped";
                  console.log(this.tableMappingModel);

                } else {
                  this.tableMappingModel[5].fields[2].status = "Type must be datetime"
                }
              }
            }
          } else {
            this.tableMappingModel[5].fields[2].status = "Not mapping yet";
          }
        }
      }
    } else {
      this.tableMappingModel[5].fields[2].status = "Not mapping yet";
    }
  }

  //onchange file
  public onChange(fileList: FileList): void {
    let file = fileList[0];
    let fileReader: FileReader = new FileReader();
    let self = this;
    fileReader.onloadend = function () {
      self.fileContent = fileReader.result;
    }
    fileReader.readAsText(file);
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  changeCheckSync(event) {
    this.loadingConfirm = true;
    let account = {};
    account['id'] = Number.parseInt(localStorage.getItem('id'));
    account['is_schedule'] = !this.checkSync;
    this.companyConnectionService.changeSchedule(account).subscribe(
      (res: any) => {

        if (res.code == 400) {
          this.toast.warning(res.message);
        } else {
          this.toast.success(res.message);
        }
        this.loadingConfirm = false;
        this.dialog.closeAll();
        this.getSchedule();
      }, (err) => {
        this.loadingConfirm = false;
        this.dialog.closeAll();
        if (err.status == 0) {
          this.toast.error("Connection timeout!");
        } if (err.status == 400) {
          this.toast.error("Server is not available!");
        }
        this.toast.error("Server is not available!");
      }
    )
  }

  saveScheduleTime() {
    this.loadingFull = true;
    let check = false;
    let minute = '*';
    let hours = '*';
    let dayInMonth = '*';
    let dayInWeek = '*';
    // console.log("start parst time");
    // console.log(this.monthTime);
    console.log(this.weekTime);
    console.log(this.dailyTime);

    console.log(this.typeSync);

    if (this.typeSync === 1 && this.monthDayChoose !== null && this.monthDayChoose !== undefined
      && this.monthDayChoose.length > 0
      && this.monthTime !== undefined
      && this.monthTime !== null
      && this.monthTime !== ''
    ) {

      this.monthTime = moment(this.monthTime, 'HH:mm').format('HH:mm');
      dayInMonth = '';
      for (let i = 0; i < this.monthDayChoose.length; i++) {
        dayInMonth += this.monthDayChoose[i];
        if (i != this.monthDayChoose.length - 1) {
          dayInMonth += ',';
        }
      }
      hours = this.monthTime.split(':', 1);
      let n = this.monthTime.indexOf(":");
      let length = this.monthTime.length;
      minute = this.monthTime.slice(n + 1, length);
      check = true;

    } else if (this.typeSync === 2 && this.weekDayChoose !== null && this.weekDayChoose !== undefined
      && this.weekDayChoose.length > 0
      && this.weekTime !== undefined
      && this.weekTime !== null
      && this.weekTime !== '') {
      this.weekTime = moment(this.weekTime, 'HH:mm').format('HH:mm');
      dayInWeek = '';
      for (let i = 0; i < this.weekDayChoose.length; i++) {
        dayInWeek += this.weekDayChoose[i];
        if (i != this.weekDayChoose.length - 1) {
          dayInWeek += ',';
        }
      }
      hours = this.weekTime.split(':', 1);
      let n = this.weekTime.indexOf(":");
      let lenght = this.weekTime.length;
      minute = this.weekTime.slice(n + 1, lenght);
      check = true;
    } else if (this.typeSync === 3 && this.dailyTime !== undefined
      && this.dailyTime !== null
      && this.dailyTime !== ''
    ) {
      this.dailyTime = moment(this.dailyTime, 'HH:mm').format('HH:mm');
      hours = this.dailyTime.split(':', 1);
      let n = this.dailyTime.indexOf(":");
      let lenght = this.dailyTime.length;
      minute = this.dailyTime.slice(n + 1, lenght);
      check = true;
    }
    let account = {};
    account['id'] = Number.parseInt(localStorage.getItem('id'));
    account['schedule_time'] = minute + ' ' + hours + ' ' + dayInMonth + ' * ' + dayInWeek;
    if (check) {
      this.companyConnectionService.saveSchedule(account).subscribe(
        (res: any) => {
          this.loadingFull = false;
          this.loadingSubmit = false;
          this.toast.success(res.message);
          this.getSchedule();
        }, (err) => {
          this.loadingFull = false;
          this.loadingSubmit = false;
          if (err.status == 0) {
            this.toast.error("Connection timeout!");
          } if (err.status == 400) {
            this.toast.error("Server is not available!");
          }
          this.toast.error("Server is not available!");
        }
      )
    } else if (this.typeSync === 2) {
      if (this.weekDayChoose === null || this.weekDayChoose === undefined
        || this.weekDayChoose.length === 0) {
        this.toast.error("Please choose day!");
      }
      if (this.weekTime === undefined
        || this.weekTime === null
        || this.weekTime === '') {
        this.toast.error("Invalid time!");
      }
      this.getSchedule();
      this.loadingFull = false;
    } else if (this.typeSync === 1) {
      if (this.monthDayChoose === null || this.monthDayChoose === undefined
        || this.monthDayChoose.length === 0) {
        this.toast.error("Please choose day!");
      }
      if (this.monthTime === undefined
        || this.monthTime === null
        || this.monthTime === '') {
        this.toast.error("Invalid time!");
      }
      this.getSchedule();
      this.loadingFull = false;
    } else if (this.typeSync === 3) {
      if (this.dailyTime === undefined
        || this.dailyTime === null
        || this.dailyTime === '') {
        this.toast.error("Invalid time!");
      }
      this.getSchedule();
      this.loadingFull = false;
    }

  }

  async getSchedule() {
    this.loading = true;
    const id = Number.parseInt(localStorage.getItem('id'));
    this.companyConnectionService.getSchedule(id).subscribe(
      (res: any) => {
        this.loading = false;
        this.checkSync = res.is_schedule;
        let time = res.schedule_time + "";
        if (time.length > 0) {
          let arrTime = time.split(' ', 5);
          this.parseTimeCron(arrTime);
        }
      }, (error) => {
        this.loading = false;
        if (error.status == 0) {
          this.toast.error("Connection timeout!");
        } if (error.status == 400) {
          this.toast.error("Server is not available!");
        }
        this.toast.error("Server is not available!");
      }
    )
  }

  //Open dialog confirm On/Off synchronize schedule's
  openDialogScheduleConfirm(dialog, event) {
    console.log(this.checkSync);
    event.source.checked = this.checkSync;
    const dialogRef = this.dialog.open(dialog);
  }

  parseTimeCron(arrTime) {
    let time = moment(arrTime[1] + ":" + arrTime[0], 'HH:mm').format('HH:mm');
    if (arrTime[2] === "*" && arrTime[4] === "*") {
      this.typeSync = 3;
      this.dailyTime = time;
      console.log(this.dailyTime);
    } else if (arrTime[2] === "*" && arrTime[4] !== "*") {
      this.typeSync = 2;
      this.weekDayChoose = arrTime[4].split(',').map(x => +x);
      this.weekTime = time;
    } else {
      this.typeSync = 1;
      this.monthDayChoose = arrTime[2].split(',').map(x => +x);
      console.log(arrTime[1] + ":" + arrTime[0]);
      this.monthTime = time;
      console.log(this.monthTime);
    }
    let month = "";
    if (arrTime[2] !== "*") {
      month = " on day " + arrTime[2] + " of month.";
    }
    let week = "";
    if (arrTime[4] !== "*") {
      week = " on ";
      let dayWeek = arrTime[4].split(',')
      dayWeek.forEach(dayChoose => {
        this.days.forEach(element => {
          if (Number(dayChoose) === element.id) {
            week += element.name + ',';
          }
        });
      });
    }
    console.log(time);
    const arTime = time.split(':', 2);
    console.log(arTime);
    week = week.substring(0, week.length - 1);
    this.timeSchedule = "At " + arTime[0] + ":" + arTime[1] + month + week;

    console.log(this.timeSchedule);
  }
}
