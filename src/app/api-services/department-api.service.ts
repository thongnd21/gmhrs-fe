import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from '../appsetting';

@Injectable({
    providedIn: 'root'
})
export class DepartmentApiService {
    // URL = 'http://localhost:3000/api/';
    URL = AppSettings.BASEURL;
    constructor(private httpClient: HttpClient) { }

    getAllDepartment() {
        return this.httpClient.get(this.URL + AppSettings.DEPARTMENT);
    }

    createDepartment(department) {
        return this.httpClient.post(this.URL + AppSettings.DEPARTMENT, department);
    }

    updateDepartment(department) {
        return this.httpClient.put(this.URL + AppSettings.DEPARTMENT, department);
    }

    getAllDepartmentByAccountId(accountId) {
        const path = 'accountId/'
        let id = new HttpParams().set('id', accountId);
        return this.httpClient.get(this.URL + AppSettings.DEPARTMENT + path + accountId);
    }

}
