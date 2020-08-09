import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppSettings } from '../appsetting';
@Injectable({
  providedIn: 'root'
})
export class CompanyServices {
  URL = AppSettings.BASEURL;
  constructor(private httpClient: HttpClient) { }

  getAllCompany() {
    return this.httpClient.get(AppSettings.BASEURL +'accounts');
    // return this.httpClient.get('http://localhost:3000/api/accounts');
  }

  updateAccountCompany(updateAccount) {
    return this.httpClient.put(AppSettings.BASEURL +'accounts', updateAccount);
    // return this.httpClient.put('http://localhost:3000/api/accounts', updateAccount);
  }

  createAccountCompany(newAccount) {
    return this.httpClient.post(AppSettings.BASEURL +'accounts', newAccount);
    // return this.httpClient.post('http://localhost:3000/api/accounts', newAccount);
  }

  getAccountCompanyById(id) {
    // const idAccount = new HttpParams().set('id', id);
    // const test = "https://gmhrs-api.herokuapp.com/api/accounts/" + id;
    
    return this.httpClient.get(this.URL + AppSettings.ACCOUNT + id);
    // 'https://gmhrs-api.herokuapp.com/api/accounts', { params: idAccount }
  }


}
