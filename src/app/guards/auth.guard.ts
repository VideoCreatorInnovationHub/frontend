import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {catchError, map, Observable, of} from 'rxjs';
import {AuthService} from "../services/auth.service";
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router) {
  }

  /**
   * Determines if a given route can be activated
   *
   * @param {ActivatedRouteSnapshot} route - The snapshot of the route that wants to get activated
   * @param {RouterStateSnapshot} state - The snapshot of the Router
   * @return {boolean} canActivate - whether this route
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.userInfo().pipe(
      map(() => {
        return true;
      }),

      catchError(error => {
        if (error.message === 'Unauthorized') {
          Swal.fire('Session Timeout', 'Please login again', 'error').then(() => {
              this.router.navigateByUrl('/login');
              return of(false);
          });
        }
        throw error;
      })
    );
  }

}
