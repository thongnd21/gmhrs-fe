import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppSettings } from '../appsetting';

@Injectable({
  providedIn: 'root'
})
export class CompanyConnectionService {
  URL = AppSettings.BASEURL;
  constructor(private httpClient: HttpClient) { }

  testDBCompanyConnection(DBInfor) {
    return this.httpClient.post('https://gmcompany-api.herokuapp.com/api/connection', DBInfor);
    // return this.httpClient.post('http://localhost:3000/api/connection', DBInfor);
  }


  changeSchedule(account) {
    const path = 'changeScheStatus/';
    console.log(this.URL + AppSettings.SCHEDULE + path);
    return this.httpClient.post(this.URL + AppSettings.SCHEDULE + path, account)
  }

  saveSchedule(account) {
    const path = 'save/';
    return this.httpClient.post(this.URL + AppSettings.SCHEDULE + path, account)
  }

  synchonize() {
    return this.httpClient.get(this.URL + 'gsuite/sync-all/firstSync?emailAdmin=z@capstonesummer2020-fu.page&apiEndpoint=https://hrms123.herokuapp.com/api/data-hrms&fileKeyName=gmhrs-auth-gsuite.json&accountId=1');
  }

  getSchedule(accountId) {
    const path = 'getSchedule/';
    let id = new HttpParams().set('id', accountId);
    return this.httpClient.get(this.URL + AppSettings.SCHEDULE + path, { params: id })
  }

  gsuiteCredentialTest(data) {
    const path = 'upload/';
    return this.httpClient.post(this.URL + AppSettings.FILE + path, data);
    // return this.httpClient.post(this.URL + AppSettings.FILE + path, data);
  }

  gsuiteCredentialSave(data) {
    const path = 'save/';
    return this.httpClient.post(this.URL + AppSettings.FILE + path, data);
  }
}