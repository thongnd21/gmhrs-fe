import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyConnectionService {
  constructor(private httpClient: HttpClient) { }

  testDBCompanyConnection(DBInfor) {
    return this.httpClient.post('https://gmcompany-api.herokuapp.com/api/connection', DBInfor);
    // return this.httpClient.get('http://localhost:3000/api/accounts');
  }
}