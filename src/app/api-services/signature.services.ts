import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from '../appsetting';

@Injectable({
    providedIn: 'root'
})
export class SignatureService {
    // URL = 'http://localhost:3000/api/';
    URL = AppSettings.BASEURL;
    constructor(private httpClient: HttpClient) { }

    getInfoToReview(username) {
        return this.httpClient.get(this.URL + AppSettings.GETINFOTOREVIEW + username);
    }

    sendSignatureTemplate(username, template) {
        return this.httpClient.post(this.URL + AppSettings.SIGNATURETEMPLATE + username, template);
    }

    getSignatureTemplate(username) {
        return this.httpClient.get(this.URL + AppSettings.GETSIGNATURE + username);
    }

    sendSignatureTemplateRules(username, rules) {
        return this.httpClient.post(this.URL + AppSettings.SIGNATURETEMPLATERULES + username, rules);
    }

    getSignatureTemplateRules(username) {
        return this.httpClient.get(this.URL + AppSettings.GETSIGNATURERULES + username);
    }
}