import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../appsetting';

@Injectable({
    providedIn: 'root'
  })
export class EmailApiService {
    // URL = 'http://localhost:3000/api/';
    URL = AppSettings.BASEURL;
    constructor(private httpClient: HttpClient) { }

    createEmailTemplate(emailObj) {
        return this.httpClient.post(this.URL + AppSettings.EMAIL,emailObj);
    }
}