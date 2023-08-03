import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    public route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit(): void {}
  /**
   * Handles basic login action, if the credential format is invalid then report it to user and exits the login logic
   * Otherwise pass the credentials to backend for authentication, if the login has success status, store the tokens
   * and redirect user to the chat window. If the login failed, report that to the user along with error message
   *
   * @param {string} username - the email used for login
   * @param {string} password - the password entered
   */
  public login(username: string, password: string) {
    const user = new User();
    user.username = username;
    user.password = password;

    if (this.invalidCredential(password, username)) {
      Swal.fire('Invalid Credential ', 'Invalid Email or password', 'error');
      return;
    }

    this.authService.login(user).subscribe({
      next: (response) => {
        Swal.fire(
          'Login Success',
          '',
          'success'
        );
        localStorage.setItem('acc', response.access_token);
        this.router.navigateByUrl(`/portfolio`);
      },

      error: (err) => {
        Swal.fire('There was an error:', err.error.errors[0], 'error');
      },
    });
  }

  /**
   * Checks if the email and password matches the designated format
   *
   * @param {string} username - email
   * @param {string} pwd - password
   */
  private invalidCredential(
    pwd: string,
    username: string
  ): boolean {
    return username === '' || pwd === '';
  }

}
