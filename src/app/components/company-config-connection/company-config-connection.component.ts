import { Component, OnInit } from '@angular/core';
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
import { MatDialog } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountApiService } from '../../api-services/account-api.service';
import { STRING_TYPE } from '@angular/compiler';


@Component({
  selector: 'app-company-config-connection',
  templateUrl: './company-config-connection.component.html',
  styleUrls: ['./company-config-connection.component.css']
})
export class CompanyConfigConnectionComponent implements OnInit {
  accessDBForm: FormGroup;
  connection = true;
  timeMonthDate = true;
  isOptional = false;
  gsuiteCredentialForm: FormGroup;
  APIEndpointForm: FormGroup;
  account;
  fileContent;
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
  dataAPIEndpoindEmployee = { // json format employee to admin company checking field when input api endpoint
    employee: {
      id: "Required",
      primary_email: "Required",
      personal_email: "Required",
      first_name: "Required",
      last_name: "Required",
      phone: "Required",
      address: "Required",
      department: {
        id: "Required",
        name: "Required",
      },
    }

  };
  dataAPIEndpoindDepartment = {// json format department to admin company checking field when input api endpoint
    department: {
      id: "Required",
      name: "Required",
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
  apiEndpointResultEmployeeList = [];
  apiEndpointResultDepartmentList = [];
  apiEndpointResultTeamList = [];
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
  connectionStringDataResponseEmployee = { // json format employee to admin company checking field when input api endpoint
    employee: {
      id: "Required",
      primary_email: "Required",
      personal_email: "Required",
      first_name: "Required",
      last_name: "Required",
      phone: "Required",
      address: "Required",
      department_id: "Required"
    }

  };
  connectionStringDataResponseDepartment = {// json format department to admin company checking field when input api endpoint
    department: {
      id: "Required",
      name: "Required",
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
  ) {

  }

  ngOnInit() {
    this.getSchedule();
    this.createConnectionStringForm();
    this.createFormApiEndpoint();
    for (let i = 1; i < 32; i++) {
      this.dayInMonth.push(i);
    }
    this.createGsuiteCredentialForm();
    console.log(this.checkSync);
  }


  // form connection String
  createConnectionStringForm() {
    const accountId = localStorage.getItem('id');
    this.account = new AccountCompanyModel;

    // var stringConection: any;
    this.accessDBForm = this.fb.group({
      dbName: new FormControl('', [Validators.required]),
      host: new FormControl('', [Validators.required]),
      port: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      dialect: new FormControl(''),
    });
    this.companyServices.getAccountCompanyById(accountId).subscribe(
      (res: any) => {
        if (res.connection_database != undefined && res.connection_database.length > 1) {
          this.account.connection_database = res.connection_database;
          console.log(res.connection_database);
          this.accessDBForm = this.fb.group({
            dbName: new FormControl(res.connection_database.split(" ")[0], [Validators.required]),
            host: new FormControl(res.connection_database.split(" ")[1], [Validators.required]),
            port: new FormControl(res.connection_database.split(" ")[2], [Validators.required]),
            username: new FormControl(res.connection_database.split(" ")[3], [Validators.required]),
            password: new FormControl(res.connection_database.split(" ")[4], [Validators.required]),
            dialect: new FormControl(res.connection_database.split(" ")[5]),
          });
          this.disableSaveConnectionStringButton = false;
          this.disableTestConnectionStringButton = false;
        }
        else {
          console.log("else")
          this.disableSaveConnectionStringButton = false;
          this.disableTestConnectionStringButton = true;
        }

      },
      (error) => {
        console.log(error);
      }
    );
  }

  createGsuiteCredentialForm() {
    this.gsuiteCredentialForm = this.fb.group({
      company_email: new FormControl('', [Validators.required, Validators.email]),
      file: new FormControl('')
    })
  }

  disableTestAuthenGsuiteButton = true;
  fileChange(element) {
    this.uploadedFiles = element.target.files;
    if (this.uploadedFiles[0].name.split('.')[1] != "json") {
      this.toast.error("Please input only JSON file!");
      this.disableTestAuthenGsuiteButton = true;
    } else {
      this.disableTestAuthenGsuiteButton = false;
    }
  }


  //test file authen guite
  onTest(modal, value) {
    let formData = new FormData();
    let company_email = value.company_email;
    for (var i = 0; i < this.uploadedFiles.length; i++) {
      formData.append("file", this.uploadedFiles[i], this.uploadedFiles[i].name);
    }
    formData.set("company_email", company_email);

    this.http.post('http://localhost:3000/api/file/upload', formData)
      // this.http.post('https://gmhrs-api.herokuapp.com/api/file/upload', formData)
      .subscribe(
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
          this.modalService.open(modal, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
        },
        (error) => {
          this.toast.error("Server is not available!");
        })
  }

  //upload file authen gsuite
  upload(value) {
    this.account = new AccountCompanyModel;
    this.account.primary_email = value.company_email;
    this.account.id = localStorage.getItem('id');
    this.http.post('http://localhost:3000/api/file/save', this.account)
      .subscribe(
        (res) => {
          const result: any = res;
          if (result.status == "success") {
            this.toast.success("Con-fig G-Suite Authentication Successfully!");
            this.closeModal();
          }
          if (result.status == "fail") {
            this.toast.error("Con-fig G-Suite Authentication fail!");
          }
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


  onTestURLConection(value) {
    console.log(value);
    const endpoint = value.url
    this.loadingTestAPI = true;
    this.accountServices.testAPIEndpoint(endpoint).subscribe(
      (res: any) => {
        this.apiEndpointResultEmployeeList = res.employees.length > 0 ? res.employees : null;
        this.apiEndpointResultDepartmentList = res.departments.length > 0 ? res.departments : null;
        this.apiEndpointResultTeamList = res.teams.length > 0 ? res.teams : null;
        var check = this.checkingFormatData(
          this.apiEndpointResultEmployeeList,
          this.apiEndpointResultDepartmentList,
          this.apiEndpointResultTeamList);
        this.anableButtonSaveAPIEndpoint = check;
        this.enableDataAPIResult = true;
        this.loadingTestAPI = false;
      },
      (error) => {
        this.loadingTestAPI = false;
        this.toast.error(error.message);
        console.log(error);
      }
    )
  }

  // checking data json from api endpoint result after test
  checkingFormatData(employee, department, team) {

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
      console.log("vong for: " + i);
      // if pass all field stop for 
      if (this.dataAPIEndpoindEmployee.employee.id == "Pass" && this.dataAPIEndpoindEmployee.employee.primary_email == "Pass"
        && this.dataAPIEndpoindEmployee.employee.first_name == "Pass" && this.dataAPIEndpoindEmployee.employee.last_name == "Pass"
        && this.dataAPIEndpoindEmployee.employee.phone == "Pass" && this.dataAPIEndpoindEmployee.employee.address == "Pass"
        && this.dataAPIEndpoindEmployee.employee.department.id == "Pass"
        && this.dataAPIEndpoindEmployee.employee.department.name == "Pass") {
        this.employeeValidate = true;
        i = employee.length - 1;
      }
    };
    //check field in each department
    for (var i = 0; i < department.length; i++) {
      department[i].id === undefined ? this.dataAPIEndpoindDepartment.department.id = "Missing Field" : this.dataAPIEndpoindDepartment.department.id = "Pass";
      department[i].name === undefined ? this.dataAPIEndpoindDepartment.department.name = "Missing Field" : this.dataAPIEndpoindDepartment.department.name = "Pass";
      console.log("vong for dep: " + i);
      //if pass all fields >> stop for
      if (this.dataAPIEndpoindDepartment.department.id == "Pass"
        && this.dataAPIEndpoindDepartment.department.name == "Pass") {
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
    // if (this.employeeValidate == false) {
    //   if (this.dataAPIEndpoindEmployee.employee.id == "Missing Field") {
    //     this.employees.employee["id"] = "Missing Field";
    //   };
    //   if (this.dataAPIEndpoindEmployee.employee.primary_emai == "Missing Field") {
    //     this.employees.employee["primary_email"] = "Missing Field";
    //   };
    //   if (this.dataAPIEndpoindEmployee.employee.personal_email == "Missing Field") {
    //     this.employees.employee["personal_email"] = "Missing Field";
    //   };
    //   if (this.dataAPIEndpoindEmployee.employee.first_name == "Missing Field") {
    //     this.employees.employee["first_name"] = "Missing Field";
    //   };
    //   if (this.dataAPIEndpoindEmployee.employee.last_name == "Missing Field") {
    //     this.employees.employee["last_name"] = "Missing Field";
    //   };
    //   if (this.dataAPIEndpoindEmployee.employee.phone == "Missing Field") {
    //     this.employees.employee["phone"] = "Missing Field";
    //   };
    //   if (this.dataAPIEndpoindEmployee.employee.address == "Missing Field") {
    //     this.employees.employee["address"] = "Missing Field";
    //   };
    // };
    // if (this.departmentValidate == false) {
    //   if (this.dataAPIEndpoindDepartment.department.id == "Missing Field") {
    //     this.departments.department["id"] = "Missing Field";
    //   };
    //   if (this.dataAPIEndpoindDepartment.department.name == "Missing Field") {
    //     this.departments.department["name"] = "Missing Field";
    //   };
    // }
    // if (this.teamValidate == false) {
    //   if (this.dataAPIEndpoindTeam.team.id == "Missing Field") {
    //     this.departments.department["id"] = "Missing Field";
    //   };
    //   if (this.dataAPIEndpoindTeam.team.name == "Missing Field") {
    //     this.departments.department["name"] = "Missing Field";
    //   };
    //   if (this.dataAPIEndpoindTeam.team.email == "Missing Field") {
    //     this.departments.department["email"] = "Missing Field";
    //   };
    //   if (this.dataAPIEndpoindTeam.team.member[0].id == "Missing Field" &&
    //     this.dataAPIEndpoindTeam.team.member[0].primary_email == "Missing Field") {
    //     this.member["id"] = "Missing Field";
    //     this.member["primary_email"] = "Missing Field";
    //     this.members.push(this.member);
    //     this.teams.team["members"] = this.members;
    //   }
    //   else if (this.dataAPIEndpoindTeam.team.member[0].id != "Missing Field" &&
    //     this.dataAPIEndpoindTeam.team.member[0].primary_email == "Missing Field") {
    //     this.member["primary_email"] = "Missing Field";
    //     this.members.push(this.member);
    //     this.teams.team["members"] = this.members;
    //   }
    //   else if (this.dataAPIEndpoindTeam.team.member[0].primary_email != "Missing Field" &&
    //     this.dataAPIEndpoindTeam.team.member[0].id == "Missing Field") {
    //     this.member["id"] = "Missing Field";
    //     this.members.push(this.member);
    //     this.teams.team["members"] = this.members;
    //   }
    // }
    //comsume status of employee, department, team and return

    if (this.employeeValidate == true && this.departmentValidate == true && this.teamValidate == true) {
      return true;
    } else {
      return false;
    }
  }



  // test connection string
  onTestConection(modal, value) {
    this.loadingTestConnection = true;
    this.companyConnection = new CompanyConnection();
    this.companyConnection.dbName = value.dbName;
    this.companyConnection.host = value.host;
    this.companyConnection.port = value.port;
    this.companyConnection.username = value.username;
    this.companyConnection.password = value.password;
    this.companyConnection.dialect = value.dialect;
    console.log(this.companyConnection);
    this.companyConnectionService.testDBCompanyConnection(this.companyConnection).subscribe(
      (res: any) => {
        // const result: any = res;
        // console.log(result);
        console.log(res);
        
        if (res.checkConnection.status == true) {
          this.loadingTestConnection = false;
          this.apiEndpointResultEmployeeList = res.employees.length > 0 ? res.employees : null;
          this.apiEndpointResultDepartmentList = res.departments.length > 0 ? res.departments : null;
          this.apiEndpointResultTeamList = res.teams.length > 0 ? res.teams : null;
          var check = this.checkingFormatData(
            this.apiEndpointResultEmployeeList,
            this.apiEndpointResultDepartmentList,
            this.apiEndpointResultTeamList);
          this.enableDataAPIResult = true;
          console.log(this.dataAPIEndpoindEmployee);
        } else {
          this.loadingTestConnection = false;
          this.enableDataAPIResult = true;
        }


        // console.log(result.checkConnection);

        // if (result.checkConnection.status == true) {
        //   //employee
        //   result.employee.id === undefined ? this.connectionStringDataResponseEmployee.employee.id = "Table Missing Field" : this.connectionStringDataResponseEmployee.employee.id = "Pass";
        //   result.employee.primary_email === undefined ? this.connectionStringDataResponseEmployee.employee.primary_email = "Missing Field" : this.connectionStringDataResponseEmployee.employee.primary_email = "Pass";
        //   result.employee.personal_email === undefined ? this.connectionStringDataResponseEmployee.employee.personal_email = "Missing Field" : this.connectionStringDataResponseEmployee.employee.personal_email = "Pass";
        //   result.employee.first_name === undefined ? this.connectionStringDataResponseEmployee.employee.first_name = "Missing Field" : this.connectionStringDataResponseEmployee.employee.first_name = "Pass";
        //   result.employee.last_name === undefined ? this.connectionStringDataResponseEmployee.employee.last_name = "Missing Field" : this.connectionStringDataResponseEmployee.employee.last_name = "Pass";
        //   result.employee.phone === undefined ? this.connectionStringDataResponseEmployee.employee.phone = "Missing Field" : this.connectionStringDataResponseEmployee.employee.phone = "Pass";
        //   result.employee.address === undefined ? this.connectionStringDataResponseEmployee.employee.address = "Missing Field" : this.connectionStringDataResponseEmployee.employee.address = "Pass";
        //   result.employee.department_id === undefined ? this.connectionStringDataResponseEmployee.employee.department_id = "Missing Field" : this.connectionStringDataResponseEmployee.employee.department_id = "Pass";
        //   //department
        //   result.department.id === undefined ? this.connectionStringDataResponseDepartment.department.id = "Missing Field" : this.connectionStringDataResponseDepartment.department.id = "Pass";
        //   result.department.name === undefined ? this.connectionStringDataResponseDepartment.department.name = "Missing Field" : this.connectionStringDataResponseDepartment.department.name = "Pass";
        //   //team
        //   result.team.id === undefined ? this.connectionStringDataResponseTeam.team.id = "Missing Field" : this.connectionStringDataResponseTeam.team.id = "Pass";
        //   result.team.name === undefined ? this.connectionStringDataResponseTeam.team.name = "Missing Field" : this.connectionStringDataResponseTeam.team.name = "Pass";
        //   result.team.email === undefined ? this.connectionStringDataResponseTeam.team.email = "Missing Field" : this.connectionStringDataResponseTeam.team.email = "Pass";
        //   //team_employee
        //   result.team_employee.employee_id === undefined ? this.connectionStringDataResponseTeamEmployee.team_employee.employee_id = "Missing Field" : this.connectionStringDataResponseTeamEmployee.team_employee.employee_id = "Pass";
        //   result.team_employee.team_id === undefined ? this.connectionStringDataResponseTeamEmployee.team_employee.team_id = "Missing Field" : this.connectionStringDataResponseTeamEmployee.team_employee.team_id = "Pass";
        //   //open modal
        //   this.modalService.open(modal, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
        // }
        // if (status.status == 0) {
        //   this.loadingTestConnection = false;
        //   this.disableSaveConnectionStringButton = false;
        //   console.log(res);
        //   this.toast.error("Connection fail!!");
        // } else if (status.status == 200) {
        //   this.loadingTestConnection = false;
        //   this.disableSaveConnectionStringButton = true;
        //   this.toast.success("Database connection success!");
        // }

      },
      (error) => {
        this.loadingTestConnection = false;
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
      this.companyConnection.dialect;

    const id = localStorage.getItem('id');
    this.account = new AccountCompanyModel;
    this.account.id = id;
    this.account.connection_database = connectionString;
    console.log(this.account.connection_database);
    this.companyServices.updateAccountCompany(this.account).subscribe(
      (res) => {
        this.toast.success("Save connection success!");
      },
      (error) => {
        this.toast.error("Server is not available!");
      }
    )
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
    console.log(account);
    this.companyConnectionService.changeSchedule(account).subscribe(
      (res: any) => {
        this.toast.success(res.message);
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
    this.loadingSubmit = true;
    console.log(this.loadingSubmit);
    let minute = '*';
    let hours = '*';
    let dayInMonth = '*';
    let dayInWeek = '*';
    console.log("start parst time");
    if (this.typeSync === 1) {
      this.monthTime = moment(this.monthTime, 'HH:mm').utc().format('HH:mm');
      dayInMonth = '';
      console.log(this.monthDayChoose);
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
    } else
      if (this.typeSync === 2) {
        this.weekTime = moment(this.weekTime, 'HH:mm').utc().format('HH:mm');
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
      } else {
        this.dailyTime = moment(this.dailyTime, 'HH:mm').utc().format('HH:mm');
        hours = this.dailyTime.split(':', 1);
        let n = this.dailyTime.indexOf("@");
        let lenght = this.dailyTime.length;
        minute = this.dailyTime.slice(n + 1, lenght);
      }
    let account = {};
    account['id'] = Number.parseInt(localStorage.getItem('id'));
    account['schedule_time'] = minute + ' ' + hours + ' ' + dayInMonth + ' * ' + dayInWeek;
    this.companyConnectionService.saveSchedule(account).subscribe(
      (res: any) => {
        this.loadingSubmit = false;
        this.toast.success(res.message);
        this.getSchedule();
      }, (err) => {
        this.loadingSubmit = false;
        if (err.status == 0) {
          this.toast.error("Connection timeout!");
        } if (err.status == 400) {
          this.toast.error("Server is not available!");
        }
        this.toast.error("Server is not available!");
      }
    )
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
    let time = moment.utc(arrTime[1] + ":" + arrTime[0], 'HH:mm').local().format('HH:mm');
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
