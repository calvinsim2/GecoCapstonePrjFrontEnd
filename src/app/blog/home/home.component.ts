import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isLoggedIn !: boolean;
  loggedInName !: any;
  loggedInUserId !: any;
  constructor(private router : Router, private authService : AuthService, private userService : UserService) { }

  ngOnInit(): void {
    
    this.isLoggedIn = !!this.authService.getLoggedInUser() ? true : false;
    this.getOnTimeUserName();
    this.loggedInUserId = this.authService.getLoggedInUserID();
  }

  getOnTimeUserName() {
    this.userService.getUserbyId(this.authService.getLoggedInUserID()).subscribe({
      next: (res) => {
        this.loggedInName = res?.result?.fullName;
      }
    })
  }

  goToBlog(){
    this.router.navigate([`blog/blog`])
  }

  goToRules(){
    this.router.navigate([`blog/rules`])
  }

  goToProfile(){
    this.router.navigate([`blog/user/${this.loggedInUserId}`])
  }

  goToLogin(){
    this.router.navigate([`login`])
  }



}
