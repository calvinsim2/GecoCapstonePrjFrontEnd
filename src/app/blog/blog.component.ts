import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  isLoggedIn!: boolean;
  userIsAdmin!: boolean;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.authService.getLoggedInUser() ? true : false;
    this.userIsAdmin = this.authService.getLoggedInRoleID() == 3 ? true : false;
  }

  // Navigation

  logOut() {
    this.authService.logout();
    this.router.navigate([`login`]);
  }

  logIn() {
    this.router.navigate([`login`]);
  }

  navigateToProfile() {
    this.router.navigate([`blog/user/${this.authService.getLoggedInUserID()}`]);
  }

  setNavBarColor() {
    return this.userIsAdmin == true ? 'lightgreen' : 'mistyrose';
  }
}
