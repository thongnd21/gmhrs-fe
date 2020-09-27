import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class AccountApiService {
    // URL = 'http://localhost:3000/api/';
    URL = AppSettings.BASEURL;
    constructor(private httpClient: HttpClient) { }

    checkPrimarySetting(id) {
        return this.httpClient.get(this.URL + AppSettings.CHECKPRIMARYSETTING + id);
    }
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

    testAPIEndpoint(url, username, password, token, selected) {
        console.log(username + " " + password + " " + token);

        var header = null;
        if (selected == "Basic Auth") {
            var buff = btoa(username + ":" + password);
            header = new HttpHeaders({ Authorization: "Basic " + buff });

        } else if (selected == "Token Bearer") {
            header = new HttpHeaders({ Authorization: "Bearer " + token });
        }
        return this.httpClient.get(url + "?selected=" + selected, { headers: header });
    };

    getInvalidSignature() {
        const path = 'getListEmployeesEmailBreakRule/'
        return this.httpClient.get(this.URL + AppSettings.SIGNATURE + path + localStorage.getItem("id"));
    };

    getAllEmployeeByAccountId(accountId) {
        const path = 'getAll/'
        return this.httpClient.get(this.URL + AppSettings.EMP + path + accountId);
    }

    getActivityLog() {
        return this.httpClient.get(this.URL + 'logs?accountId=' + localStorage.getItem("id"));
    };

    getAllEmployeeByDepartmentId(id) {
        // return this.httpClient.get(this.URL + +AppSettings.EMP + id);
        const path = 'department/'
        return this.httpClient.get(this.URL + AppSettings.EMP + path + id);
    }

    getAllEmployeeByTeamId(id) {
        // return this.httpClient.get(this.URL + +AppSettings.EMP + id);
        const path = 'team/'
        return this.httpClient.get(this.URL + AppSettings.EMP + path + id);
    }

    getEmployeeDetail(id) {
        return this.httpClient.get(this.URL + AppSettings.EMP + '/' + id);
    }

    getMappingConfig(accountId) {
        let path = "getMappingConfig/get"
        let param = new HttpParams().set('id', accountId);
        // return this.httpClient.get('http://localhost:3000/api/email/syncReplyMail',{params: param});
        return this.httpClient.get(this.URL + AppSettings.ACCOUNT + path, { params: param });
    }

}
