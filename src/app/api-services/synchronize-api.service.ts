import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppSettings } from '../appsetting';

@Injectable({
  providedIn: 'root'
})
export class SynchronizeService {
  constructor(private httpClient: HttpClient) { }
  URL = AppSettings.BASEURL;

  getListSynchronize(accountId,check){
    const path = 'sync-all/sync';
    const param = new HttpParams().set('accountId', accountId).set('checked',check);
    console.log(this.URL + AppSettings.GSUITE + path, {params : param});
    return this.httpClient.get(this.URL + AppSettings.GSUITE + path, {params : param});
  }

}