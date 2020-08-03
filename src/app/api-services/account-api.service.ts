import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class AccountApiService {
    // URL = 'http://localhost:3000/api/';
    URL = AppSettings.BASEURL;
    constructor(private httpClient: HttpClient) { }

    getAllEmployee() {
        return this.httpClient.get(this.URL + AppSettings.EMP + 'getAll/' + localStorage.getItem("id"));
    }

    updateProfileInfo(account) {
        return this.httpClient.put(this.URL + AppSettings.EMP, account);
    };

    createAccount(account) {
        return this.httpClient.post(this.URL + AppSettings.EMP, account)
    };

    getAccount(id) {
        return this.httpClient.get(this.URL + AppSettings.EMP + id);
    };

    addAccountToTeam(account) {
        const path = 'addToTeam/';
        return this.httpClient.post(this.URL + AppSettings.EMP + path, account)
    };

    sendMailToChangPassword(account) {
        const path = 'sendMail/';
        return this.httpClient.put(this.URL + AppSettings.ACCOUNT + path, account);
    };

    changePassword(account) {
        const path = 'changePassword/';
        return this.httpClient.put(this.URL + AppSettings.ACCOUNT + path, account);
    };

    testAPIEndpoint(url) {
        return this.httpClient.get(url);
    };

    getInvalidSignature() {
        const path = 'getListEmployeesEmailBreakRule/'
        return this.httpClient.get(this.URL + AppSettings.SIGNATURE + path + localStorage.getItem("id"));
    };


}
