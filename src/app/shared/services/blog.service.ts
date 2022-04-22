import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  public baseApiUrl: string = 'https://localhost:44364/api/Blog/';
  constructor(private http: HttpClient, private authService : AuthService) {}

  getAllBlog() {
    return this.http.get<any>(this.baseApiUrl, this.authService.httpOptionsProvider());
  }

  getBlogbyId(id: any) {
    return this.http.get<any>(this.baseApiUrl + id, this.authService.httpOptionsProvider());
  }

  getBlogByUser(id: any) {
    return this.http.get<any>(`${this.baseApiUrl}blogger/${id}`, this.authService.httpOptionsProvider());
  }

  addBlog(formData: any) {
    return this.http.post<any>(`${this.baseApiUrl}add`, formData, this.authService.httpOptionsProvider());
  }

  updateBlog(empObj: any) {
    return this.http.put<any>(`${this.baseApiUrl}update`, empObj, this.authService.httpOptionsProvider());
  }

  deleteBlog(id: any) {
    return this.http.delete<any>(`${this.baseApiUrl}${id}`, this.authService.httpOptionsProvider());
  }
}
