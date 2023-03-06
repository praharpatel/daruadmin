import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExternalProductsService {
  public url: string;

  constructor(
    public http: HttpClient
  ) {
    this.url = 'https://reqres.in/';
  }

  getUser(): Observable<any> {
    return this.http.get(this.url + 'api/users/2');
  }
}
