import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  isLoggedIn !: boolean;
  loggedInName !: any;
  loggedInUserId !: any;
  constructor(private router : Router, private authService : AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.authService.getLoggedInUser() ? true : false;
    this.loggedInName = this.authService.getLoggedInUser();
    this.loggedInUserId = this.authService.getLoggedInUserID();
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

}
