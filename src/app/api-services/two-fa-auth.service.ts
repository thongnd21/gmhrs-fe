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

    checkBypassOtp(username) {
        console.log(this.URL + AppSettings.CHECKBYPASSOTP + username);
        return this.httpClient.get(this.URL + AppSettings.CHECKBYPASSOTP + username);
        // return this.httpClient.get('https://gmhrs-api.herokuapp.com/api/' + AppSettings.CHECKBYPASSOTP + username);
    }

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

    deactivated2FA(otp, username) {
        return this.httpClient.get(this.URL + AppSettings.DEACTIVATED2FA + otp + '/' + username)
    }
    check2faStatus(username) {
        return this.httpClient.get(this.URL + AppSettings.CHECK2FASTATUS + username);
    }
}