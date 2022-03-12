import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Globals } from '../models/Globals';

@Injectable({
  providedIn: 'root'
})
export class AppconfigService {

  private config: any;

  constructor(private http: HttpClient) {
  }

  public getConfig(key: any) {
    return this.config[key];
  }

  loadAppConfig() {
    const headers: HttpHeaders = new HttpHeaders();
    headers.append('X-Frame-Options', 'SAMEORIGIN');
    headers.append('X-Content-Type-Options', 'nosniff');
    const options = { headers };
    return this.http.get('./assets/app-Config.json', options)
      .toPromise()
      .then(data => {
        this.config = data;
        Globals.setGlobals(this.config);
      });
  }
}
