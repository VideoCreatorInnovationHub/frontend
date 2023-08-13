import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {environment} from "../../environments/environment";
import {JwtRequest} from "../dto/jwt-request";
import {User} from "../models/user";
import {RouterTestingModule} from "@angular/router/testing";

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [AuthService],
    });

    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('signup', () => {
    it('should send a POST request with the user data', () => {
      const user: User = { username: 'testuser', password: 'testpassword', email: "t@email.com", id: 1};
      const expectedResponse = "Success";

      authService.signup(user).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/signup`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(user);

      req.flush(expectedResponse);
    });

    it('should handle signup error', () => {
      const user: User = { id: -1, username: 'testuser', password: 'testpassword', email: 'testemail' };
      const errorMessage = 'Username already exists'; // Correcting the error message

      authService.signup(user).subscribe(
        () => {
          fail('Should have failed with an error');
        },
        (error) => {
          expect(error).toBeTruthy();
          expect(error.status).toBe(400);
          expect(error.statusText).toBe(errorMessage);
          expect(error.error).toBe(errorMessage);
        }
      );

      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/signup`);
      req.flush(errorMessage, { status: 400, statusText: 'Username already exists' });
    });
  });

  describe('login', () => {
    it('should send a POST request with the authenticationRequest data', () => {
      const authenticationRequest: JwtRequest = { username: 'testuser', password: 'testpassword' };
      const expectedResponse = { access_token: 'testAccessToken' };

      authService.login(authenticationRequest).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(authenticationRequest);

      req.flush(expectedResponse);
    });

    it('should handle login error', () => {
      const user: User = { id: -1, username: 'testuser', password: 'testpassword', email: 'testemail' };
      const errorMessage = 'Invalid User Credentials'; // Correcting the error message

      authService.login(user).subscribe(
        () => {
          fail('Should have failed with an error');
        },
        (error) => {
          expect(error).toBeTruthy();
          expect(error.status).toBe(400);
          expect(error.statusText).toBe(errorMessage);
          expect(error.error).toBe(errorMessage);
        }
      );

      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/login`);
      req.flush(errorMessage, { status: 400, statusText: 'Invalid User Credentials' });
    });
  });
});
