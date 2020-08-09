import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from '../appsetting';

@Injectable({
    providedIn: 'root'
})
export class PositionApiService {
    // URL = 'http://localhost:3000/api/';
    URL = AppSettings.BASEURL;
    constructor(private httpClient: HttpClient) { }


    getAllPositionByAccountId(id) {
        const path = "accountId/"
        return this.httpClient.get(this.URL + AppSettings.POSITION + path + id);
    }
}