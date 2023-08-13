import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {HttpEvent, HttpHandler, HttpRequest} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Intercepts the HTTP request by customizing the filter chain, add the Bearer token if needed
   * If the filter chain fails by receiving a 403 response from the server, then call the unauthorized handler
   *
   * @param {HttpRequest<any>} request - The current HTTP request
   * @param {HttpHandler} next - The next HTTP handler
   * @returns {Observable<HttpEvent<any>>} An Observable that resolves to a HttpEvent
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('acc');

    if (token !== null) {
      request = AuthInterceptorService.addTokenToRequest(request, token);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
          localStorage.clear();
          Swal.fire("Session Timeout", "Please login again", "error").then(r => {
            this.router.navigateByUrl('/login');
          });
        }
        return throwError(error);
      })
    );
  }

  /**
   * Add the Bearer token to the request by setting the header
   *
   * @param {HttpRequest<any>} request - The current HTTP request
   * @param {string} token - The Bearer token
   * @returns {Observable<HttpEvent<any>>} An Observable that resolves to a HttpEvent
   */
  private static addTokenToRequest(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
