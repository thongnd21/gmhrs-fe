import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyServices {
  constructor(private httpClient: HttpClient) { }

  getAllCompany() {
    return this.httpClient.get('https://gmhrs-api.herokuapp.com/api/accounts');
    // return this.httpClient.get('http://localhost:3000/api/accounts');
  }

  updateAccountCompany(updateAccount) {
    return this.httpClient.put('https://gmhrs-api.herokuapp.com/api/accounts', updateAccount);
    // return this.httpClient.put('https://localhost:3000/api/accounts', updateAccount);
  }

  createAccountCompany(newAccount) {
    // return this.httpClient.post('https://gmhrs-api.herokuapp.com/api/accounts', newAccount);
    return this.httpClient.post('http://localhost:3000/api/accounts', newAccount);
  }

  getAccountCompanyById(id) {
    // const idAccount = new HttpParams().set('id', id);
    const test = "https://gmhrs-api.herokuapp.com/api/accounts/" + id;
    return this.httpClient.get(test);
    // 'https://gmhrs-api.herokuapp.com/api/accounts', { params: idAccount }
  }

  resetAccountCompanyPassword(accont){
    return this.httpClient.put("http://localhost:3000/api/accounts/resetPassword",accont);
  }

}
