import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from '../appsetting';

@Injectable({
    providedIn: 'root'
  })
export class EmailApiService {
    // URL = 'http://localhost:3000/api/';
    URL = AppSettings.BASEURL;
    constructor(private httpClient: HttpClient) { }

    createEmailTemplate(emailObj) {
        return this.httpClient.post(this.URL + AppSettings.EMAIL+'saveEmail',emailObj);
    }

    syncEmailTemplate(templateId) {
        let param = new HttpParams().set('id',templateId); 
        return this.httpClient.get(this.URL + AppSettings.EMAIL+'syncReplyMail',{params: param});
    }

    getAllTemplate(accountId) {
        let param = new HttpParams().set('id',accountId) 
        return this.httpClient.get(this.URL + AppSettings.EMAIL+'getAllReplyMail',{params: param});
    }

    getTemplate(templateId) {
        let param = new HttpParams().set('id',templateId); 
        return this.httpClient.get(this.URL + AppSettings.EMAIL+'getReplyMail',{params: param});
    }

    getAllTemplateRuleByAccountId(accountId){
        let param = new HttpParams().set('id',accountId); 
        return this.httpClient.get(this.URL + AppSettings.EMAIL+'getTemplateRule',{params: param});
    }
    saveAssignTemplate(data){
        // return this.httpClient.post(this.URL + AppSettings.EMAIL+'saveTemplateRule',data);
        return this.httpClient.post('http://localhost:3000/api/email/saveTemplateRule',data);
    }

    syncDateForTemplate(accountId){
        let param = new HttpParams().set('id',accountId); 
        return this.httpClient.post('http://localhost:3000/api/email/syncDateForTemplate',{params: param});
        // return this.httpClient.get(this.URL + AppSettings.EMAIL+'syncDateForTemplate',{params: param});
    }
}