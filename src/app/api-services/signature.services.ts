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
    setPrimaryTemplate(data) {
        return this.httpClient.put(this.URL + AppSettings.SETPRIMARYTEMPLATE, data);
    }
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
    getAllsigantureTemplate(id) {
        return this.httpClient.get(this.URL + AppSettings.GETALLSIGNATURETEMPLATE + id);
    }
    deleteSignatureTemplateByName(id, name) {
        return this.httpClient.delete(this.URL + AppSettings.DELETETEMPLATEBYNAME + id + '/' + name);
    }
    getSignatureTemplateByName(id, name) {
        return this.httpClient.get(this.URL + AppSettings.GETSIGNATURETEMPLATEBYNAME + id + '/' + name);
    }
    saveSignatureTemplate(id, template) {
        return this.httpClient.post(this.URL + AppSettings.SIGNATURETEMPLATE + id, template);
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