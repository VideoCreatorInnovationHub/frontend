import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {User} from "../../models/user";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Handles register action, if the credential format is invalid then report it to user and exits the register logic
   * Otherwise use auth service passing the credentials to backend for account registration, if success,
   * redirect user to the login window. If the registration failed, report that to the user along with error message
   *
   * @param {string} username - the username for login
   * @param {string} email - the email used for login
   * @param {string} password - the password entered
   */
  signup(username: string, password: string, email: string) {
    let user: User = new User();
    user.username = username;
    user.password = password;
    user.email = email;

    if (this.invalidCredential(email, password, username)) {
      Swal.fire('Invalid Credential ', 'Invalid format of email, username and password cannot be null', 'error');
      return;
    }
    this.authService.signup(user).subscribe({
      next: (response) => {
        Swal.fire(
          'Signup Success',
          'You can login with user credential',
          'success'
        );
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        console.warn(err);
        Swal.fire('There was an error:', err.error.errors[0], 'error');
      },
    });
  }

  /**
   * Checks if the email, password, and username matches the designated format
   *
   * @param {string} email - email
   * @param {string} pwd - password
   * @param {string} username - username
   */
  private invalidCredential(
    email: string,
    pwd: string,
    username: string
  ): boolean {
    const pattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return !pattern.test(email) || username === '' || pwd === '';
  }

}
