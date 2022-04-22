import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public timer !: any 
  constructor(private http: HttpClient, private router : Router) {}

  startTimeOut() {
    this.timer = setTimeout(() => {
      alert('Your Session has expired, please log in again.')
      this.router.navigate(['login'])
    }, (this.getExpiryDate() - Date.now()/1000)*1000);

  }

  loginUser(loginObj: any) {
    return this.http.post<any>(
      'https://localhost:44364/api/Auth/login',
      loginObj
    );
  }

  changingPassword(userObj: any) {
    return this.http.put<any>(
      'https://localhost:44364/api/Auth/changepassword',
      userObj, this.httpOptionsProvider()
    );
  }

  resetPassword(userObj: any) {
    return this.http.put<any>(
      'https://localhost:44364/api/Auth/resetpassword',
      userObj, this.httpOptionsProvider()
    );
  }

  httpOptionsProvider() {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.getToken()
      })
    };
    return options;
  }

  isUserLogin():boolean{
    return !!localStorage.getItem("token");
  }

  getLoggedInUser(){
    if(this.isUserLogin()){
      let token = this.getToken();
      let decodedJWT = JSON.parse(window.atob(token?.split('.')[1]));
      return decodedJWT.FullName ? decodedJWT.FullName : '';
    }
  }

  getLoggedInUserID(){
    if(this.isUserLogin()){
      let token = this.getToken();
      let decodedJWT = JSON.parse(window.atob(token?.split('.')[1]));
      return decodedJWT.UserID ? decodedJWT.UserID : '';
    }
  }

  getLoggedInRoleID(){
    if(this.isUserLogin()){
      let token = this.getToken();
      let decodedJWT = JSON.parse(window.atob(token?.split('.')[1]));
      return decodedJWT.RoleID ? decodedJWT.RoleID : '';
    }
  }

  getExpiryDate(){
    if(this.isUserLogin()){
      let token = this.getToken();
      let decodedJWT = JSON.parse(window.atob(token?.split('.')[1]));
      return decodedJWT.exp ? decodedJWT.exp : 0;
    }
  }

  logout(){
    this.router.navigate(['login']);
    localStorage.clear();
    clearTimeout(this.timer);
  }

  private getToken(){
    return localStorage.getItem("token")!;
  }
}
