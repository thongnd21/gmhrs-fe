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
    getAllSignatureTemplateRules(id) {
        return this.httpClient.get(this.URL + AppSettings.GETALLSIGNATURERULE + id);
    }
    setPrimaryTemplate(data) {
        return this.httpClient.put(this.URL + AppSettings.SETPRIMARYTEMPLATE, data);
    }
    setPrimaryTemplateRule(data) {
        return this.httpClient.put(this.URL + AppSettings.SETPRIMARYTEMPLATERULE, data);
    }
    sendMailRulesChanges(id) {
        return this.httpClient.get(this.URL + AppSettings.SENDMAILRULESCHANGES + id)
    }
    sendMailRemindEmployees(username) {
        return this.httpClient.get(this.URL + AppSettings.SENDMAILREMIND + username)
    }
    getListWrongSignature(id) {
        return this.httpClient.get(this.URL + AppSettings.GETLISTWRONGSIGANTURE + id);
    }
    updateSignatureForAllEmployees(id) {
        return this.httpClient.get(this.URL + AppSettings.UPDATESIGNATUREALL + id);
    }
    getInfoToReview(username) {
        return this.httpClient.get(this.URL + AppSettings.GETINFOTOREVIEW + username);
    }
    getAllsigantureTemplate(id) {
        return this.httpClient.get(this.URL + AppSettings.GETALLSIGNATURETEMPLATE + id);
    }
    deleteSignatureRuleByID(id, name) {
        return this.httpClient.delete(this.URL + AppSettings.DELETETEMPLATERULEBYID + id + '/' + name);
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

    saveSignatureTemplateRules(signature) {
        return this.httpClient.post(this.URL + AppSettings.SIGNATURETEMPLATERULES, signature);
    }

    getSignatureTemplateRules(username) {
        return this.httpClient.get(this.URL + AppSettings.GETSIGNATURERULES + username);
    }
    getSignatureRuleByID(id) {
        return this.httpClient.get(this.URL + AppSettings.GETSIGNATURERULEBYID + id);
    }
}