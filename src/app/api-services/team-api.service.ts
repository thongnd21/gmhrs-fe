import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from '../appsetting';

@Injectable({
    providedIn: 'root'
  })
export class TeamApiService {
    // URL = 'http://localhost:3000/api/';
    URL = AppSettings.BASEURL;
    constructor(private httpClient: HttpClient) { }

    getAllTeam() {    
        console.log(this.URL + AppSettings.TEAM);
        return this.httpClient.get(this.URL + AppSettings.TEAM );
    }

    createTeam(team) {    
        return this.httpClient.post(this.URL + AppSettings.TEAM,team);
    }

    updateTeam(team) {    
        return this.httpClient.put(this.URL + AppSettings.TEAM,team);
    }

    getTeamDetail(id){
        return this.httpClient.get(this.URL + AppSettings.TEAM + id);
    }
}