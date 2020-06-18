import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from '../appsetting';

@Injectable({
    providedIn: 'root'
})
export class TwoFaAuthService {
    // URL = 'http://localhost:3000/api/';
    URL = AppSettings.BASEURL;
    constructor(private httpClient: HttpClient) { }

    getQrCode(username) {
        console.log(this.URL + AppSettings.TWOFAAUTHGETQRCODE);
        return this.httpClient.get(this.URL + AppSettings.TWOFAAUTHGETQRCODE + username);
    }

    checkOtp(otp, username) {
        return this.httpClient.get(this.URL + AppSettings.CHECKOTP + otp + '/' + username);
    }

    activated2FA(otp, username) {
        return this.httpClient.get(this.URL + AppSettings.ACTIVATED2FA + otp + '/' + username);
    }

    deactivated2FA(username) {
        return this.httpClient.get(this.URL + AppSettings.DEACTIVATED2FA + username)
    }
    check2faStatus(username) {
        return this.httpClient.get(this.URL + AppSettings.CHECK2FASTATUS + username);
    }
    // updateTeam(team) {    
    //     return this.httpClient.put(this.URL + AppSettings.TEAM,team);
    // }

    // getTeamDetail(id){
    //     return this.httpClient.get(this.URL + AppSettings.TEAM + id);
    // }
}