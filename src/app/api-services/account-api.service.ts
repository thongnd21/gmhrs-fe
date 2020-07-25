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
        return this.httpClient.get(this.URL + AppSettings.EMP);
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
        return this.httpClient.put("https://gmhrs-api.herokuapp.com/api/accounts/sendMail", account);
    };

    changePassword(account) {
        return this.httpClient.put("https://gmhrs-api.herokuapp.com/api/accounts/changePassword", account);
    };

    testAPIEndpoint(url){
        return this.httpClient.get(url);
    };

    getInvalidSignature(){
        return this.httpClient.get("http://localhost:3000/api/signature/getListEmployeesEmailBreakRule/" + localStorage.getItem("username"));
    };


}
