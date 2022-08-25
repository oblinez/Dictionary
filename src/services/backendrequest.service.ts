import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(
    private http: HttpClient
  ) { }

  async getWords({ page, limit = 100 }:{ page: number, limit?: number}): Promise<any> {
    return this.http.get(`http://localhost:3000/wordlist/?_page=${page}&_limit=${limit}`).toPromise();
  }

}
