import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public baseApiUrl: string = 'https://localhost:44364/api/User/';
  constructor(private http: HttpClient, private authService : AuthService) {}

  getAllUser() {
    return this.http.get<any>(this.baseApiUrl, this.authService.httpOptionsProvider());
  }

  getUserbyId(id: any) {
    return this.http.get<any>(this.baseApiUrl + id, this.authService.httpOptionsProvider());
  }

  addUser(formData: any) {
    return this.http.post<any>(`${this.baseApiUrl}`, formData);
  }

  updateUser(empObj: any) {
    return this.http.put<any>(`${this.baseApiUrl}update`, empObj, this.authService.httpOptionsProvider());
  }

  deleteUser(id: any) {
    return this.http.delete<any>(`${this.baseApiUrl}${id}`, this.authService.httpOptionsProvider());
  }
}
