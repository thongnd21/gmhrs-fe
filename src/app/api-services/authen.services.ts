import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppSettings } from '../appsetting';
@Injectable({
  providedIn: 'root'
})
export class AuthenService {
  constructor(private httpClient: HttpClient) { }

  login(account) {
    return this.httpClient.post(AppSettings.BASEURL + 'auth/login', account);
    // console.log('http://localhost:3000/api/auth/login');

    // return this.httpClient.post('http://localhost:3000/api/auth/login', account);
  }

} 
