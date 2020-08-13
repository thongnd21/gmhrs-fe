import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from '../appsetting';

@Injectable({
    providedIn: 'root'
})
export class SignatureService {
    // URL = 'http://localhost:3000/api/';checkFileGsuiteKey
    URL = AppSettings.BASEURL;
    constructor(private httpClient: HttpClient) { }
    checkFileGsuiteKey(id) {
        return this.httpClient.get(this.URL + AppSettings.CHECKFILEGSUITEKEY + id);
    }
    saveSpecSignature(data) {
        return this.httpClient.put(this.URL + AppSettings.SAVESPECSIGNATURE, data);
    }
    getSpecificRule(id) {
        return this.httpClient.get(this.URL + AppSettings.GETSPECIFICRULE + id);
    }
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
    sendMailRemindEmployees(id) {
        return this.httpClient.get(this.URL + AppSettings.SENDMAILREMIND + id)
    }
    getListWrongSignature(id) {
        return this.httpClient.get(this.URL + AppSettings.GETLISTWRONGSIGANTURE + id);
    }
    updateSignatureForAllEmployees(id) {
        return this.httpClient.get(this.URL + AppSettings.UPDATESIGNATUREALL + id);
    }
    getInfoToReview(id) {
        return this.httpClient.get(this.URL + AppSettings.GETINFOTOREVIEW + id);
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

    getSignatureTemplate(id) {
        return this.httpClient.get(this.URL + AppSettings.GETSIGNATURE + id);
    }

    saveSignatureTemplateRules(signature) {
        return this.httpClient.post(this.URL + AppSettings.SIGNATURETEMPLATERULES, signature);
    }

    getSignatureTemplateRules(id) {
        return this.httpClient.get(this.URL + AppSettings.GETSIGNATURERULES + id);
    }
    getSignatureRuleByID(id) {
        return this.httpClient.get(this.URL + AppSettings.GETSIGNATURERULEBYID + id);
    }
    getDynamicRule() {
        return this.httpClient.get(this.URL + AppSettings.GETDYNAMICRULE);
    }
}