import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppSettings } from '../appsetting';

@Injectable({
  providedIn: 'root'
})
export class SynchronizeService {
  constructor(private httpClient: HttpClient) { }
  URL = AppSettings.BASEURL;

  getListSynchronize(accountId){
    const path = 'sync-all/preview';
    const param = new HttpParams().set('accountId',accountId);
    return this.httpClient.get(this.URL + AppSettings.GSUITE + path,{params:param});
  }

  synchronize(syncInfo){
    const path = 'sync-all/sync';
    return this.httpClient.post(this.URL + AppSettings.GSUITE + path,syncInfo);
  }

}