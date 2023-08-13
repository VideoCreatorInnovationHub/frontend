import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {JwtRequest} from "../dto/jwt-request";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient,
              private router: Router) { }

  public signup(user: User) : Observable<string> {
    let url = `${environment.baseUrl}/auth/signup`;
    return this.httpClient.post(url, user, { responseType: 'text', withCredentials: true });
  }

  public login(authenticationRequest: JwtRequest) : Observable<{ access_token : string }> {
    let url = `${environment.baseUrl}/auth/login`;
    return this.httpClient.post<{ access_token : string }>(url, authenticationRequest, { responseType: 'json', withCredentials: true });
  }

  public userInfo(): Observable<User> {
    let url = `${environment.baseUrl}/auth/user_info`;
    return this.httpClient.get<User>(url, { withCredentials: true });
  }
}
