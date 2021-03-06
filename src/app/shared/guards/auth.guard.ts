import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    if (this.auth.isUserLogin()) {
      return true;
    }
    this.router.navigate(['login']);
    alert('Please Login to Continue!!');
    return false;
  }

  canActivateChild() {
    return true;
  }
}
