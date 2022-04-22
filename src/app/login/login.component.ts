import { Component, OnInit } from '@angular/core';
// step 1, we need to import this 3 things to build angular forms
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // step 2. assign a variable, with the type FormGroup, the ! means accepts no initialization for now
  loginForm!: FormGroup;
  resetPasswordForm!: FormGroup;
  hidePassword: boolean = false;
  text: any = 'password';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // step 4, initialize the form builder with the inputs
    this.loginForm = this.formBuilder.group({
      Email: ['', Validators.required],
      Password: ['', Validators.required],
    });

    this.resetPasswordForm = this.formBuilder.group({
      Email: ['', Validators.email],
    });
    // when we visit the login page, we want to remove any residue token.
    localStorage.removeItem('token');
  }
  //  we need to build auth service in services, and import in to use.
  login() {
    if (this.loginForm.valid) {
      this.authService.loginUser(this.loginForm.value).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.authService.startTimeOut();
          this.router.navigate(['blog']);
          // store it in local storage.
        },
        error: (err) => {
          alert(`${err.error.statusCode} - ${err.error.message}`);
        },
      });
    } else {
      alert('Form is not valid!');
    }
  }

  // Password related

  onResetPassword() {
    this.resetPasswordForm.reset();
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      this.authService.resetPassword(this.resetPasswordForm.value).subscribe({
        next: (res) => {
          alert(`${res.message} - Please check your email for new password!`);
          this.resetPasswordForm.reset();
          document.getElementById('close-emp')?.click();
        },
        error: (err) => {
          alert(`${err.error.message}`);
        },
      });
    } else {
      alert('Email format is not valid!');
    }
  }

  onTogglePassword() {
    this.hidePassword = !this.hidePassword;
    this.text = this.hidePassword ? 'password' : 'text';
  }

  // navigation

  navigateToHome() {
    this.router.navigate([`blog/home`]);
  }

  navigateToSignUp() {
    this.router.navigate(['signup']);
  }
}
