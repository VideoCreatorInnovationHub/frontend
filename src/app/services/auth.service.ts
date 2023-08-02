import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {User} from "../models/user";
import {catchError, Observable, of, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {JwtRequest} from "../dto/jwt-request";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  public signup(user: User) : Observable<{ response : string }> {
    let url = `${environment.baseUrl}/auth/signup`;
    return this.httpClient.post<{ response : string }>(url, user);
  }

  public login(authenticationRequest: JwtRequest) : Observable<{ access_token : string }> {
    let url = `${environment.baseUrl}/auth/login`;
    return this.httpClient.post<{ access_token : string }>(url, authenticationRequest);
  }

}
