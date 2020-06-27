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
    // return this.httpClient.get('http://localhost:3000/api/accounts');
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

  synchonize(){
    return this.httpClient.get('http://localhost:3000/api/gsuite/sync-all?emailAdmin=sonncse62729@capstonesummer2020-fu.page&apiEndpoint=https://hrms123.herokuapp.com/api/data-hrms&fileKeyName=gmhrs-auth-gsuite.json');
  }

  getSchedule(accountId) {
    const path = 'getSchedule/';
    let  id = new HttpParams().set('id',accountId);
    return this.httpClient.get(this.URL + AppSettings.SCHEDULE + path, {params : id})
  }
}