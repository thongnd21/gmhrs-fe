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
    sendMailRulesChanges(username) {
        return this.httpClient.get(this.URL + AppSettings.SENDMAILRULESCHANGES + username)
    }
    sendMailRemindEmployees(username) {
        return this.httpClient.get(this.URL + AppSettings.SENDMAILREMIND + username)
    }
    getListWrongSignature(username) {
        return this.httpClient.get(this.URL + AppSettings.GETLISTWRONGSIGANTURE + username);
    }

    updateSignatureForAllEmployees(username, template) {
        return this.httpClient.post(this.URL + AppSettings.UPDATESIGNATUREALL + username, template);
    }

    getInfoToReview(username) {
        return this.httpClient.get(this.URL + AppSettings.GETINFOTOREVIEW + username);
    }

    saveSignatureTemplate(username, template) {
        return this.httpClient.post(this.URL + AppSettings.SIGNATURETEMPLATE + username, template);
    }

    getSignatureTemplate(username) {
        return this.httpClient.get(this.URL + AppSettings.GETSIGNATURE + username);
    }

    saveSignatureTemplateRules(username, rules) {
        return this.httpClient.post(this.URL + AppSettings.SIGNATURETEMPLATERULES + username, rules);
    }

    getSignatureTemplateRules(username) {
        return this.httpClient.get(this.URL + AppSettings.GETSIGNATURERULES + username);
    }
}