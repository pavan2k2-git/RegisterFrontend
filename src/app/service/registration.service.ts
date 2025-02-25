import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor() { }

  #url = 'http://localhost:5000/registerpage';

  #http = inject(HttpClient);

  registerUser(data: any): Observable<any> {
      return this.#http.post(`${this.#url}/register`, data);
  }

  getUsers(): Observable<any> {
      return this.#http.get(`${this.#url}/getusers`);
  }
}
