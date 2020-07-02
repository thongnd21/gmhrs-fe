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
  loadingSubmit = false;
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
  constructor(
    private toast: ToastrService,
    private companyServices: CompanyServices,
    private companyConnectionService: CompanyConnectionService,
    private fileUploadServices: FileUpload,
    private fb: FormBuilder,
    private http: HttpClient,
    public dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.getSchedule();
    this.createAForm();
    this.createFormApiEndpoint();
    for (let i = 1; i < 32; i++) {
      this.dayInMonth.push(i);
    }
    this.createGsuiteCredentialForm();
    console.log(this.checkSync);
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

  public onChange(fileList: FileList): void {
    let file = fileList[0];
    let fileReader: FileReader = new FileReader();
    let self = this;
    fileReader.onloadend = function () {
      self.fileContent = fileReader.result;
    }
    fileReader.readAsText(file);
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
      },(err)=>{
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
      this.monthTime = moment(this.monthTime,'HH:mm').utc().format('HH:mm');
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
        this.weekTime = moment(this.weekTime,'HH:mm').utc().format('HH:mm');
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
        this.dailyTime = moment(this.dailyTime,'HH:mm').utc().format('HH:mm');
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
      },(err)=>{
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
    this.loading =true;
    const id = Number.parseInt(localStorage.getItem('id'));
    this.companyConnectionService.getSchedule(id).subscribe(
      (res: any) => {
        this.loading =false;
        this.checkSync = res.is_schedule;
        let time = res.schedule_time + "";
        if (time.length > 0) {
          let arrTime = time.split(' ', 5);
          this.parseTimeCron(arrTime);
        }
      }, (error) => {
        this.loading =false;
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
    let time = moment.utc(arrTime[1]+":"+arrTime[0],'HH:mm').local().format('HH:mm');
    if (arrTime[2] === "*" && arrTime[4] === "*") {
      this.typeSync=3;
      this.dailyTime = time;
      console.log(this.dailyTime);
    }else if (arrTime[2] === "*" && arrTime[4] !== "*") {
      this.typeSync=2;
      this.weekDayChoose= arrTime[4].split(',').map(x=>+x);
      this.weekTime = time;
    }else{
      this.typeSync=1;
      this.monthDayChoose= arrTime[2].split(',').map(x=>+x);
      console.log(arrTime[1]+":"+arrTime[0]);
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
    const arTime = time.split(':',2);
    console.log(arTime);
    week = week.substring(0, week.length - 1);
    this.timeSchedule = "At " + arTime[0] + ":" + arTime[1] + month + week;

    console.log(this.timeSchedule);
  }
}
