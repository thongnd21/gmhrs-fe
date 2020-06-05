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

}
