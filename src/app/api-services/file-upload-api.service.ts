import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileUpload {
  constructor(private httpClient: HttpClient) { }

  uploadFile(test) {
    return this.httpClient.post('http://localhost:3000/api/file/upload', test);
    // return this.httpClient.get('http://localhost:3000/api/accounts');
  }
}