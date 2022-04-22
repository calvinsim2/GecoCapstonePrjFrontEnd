import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  public baseApiUrl: string = 'https://localhost:44364/api/Comment/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllComment() {
    return this.http.get<any>(this.baseApiUrl, this.authService.httpOptionsProvider());
  }

  getCommentbyId(id: any) {
    return this.http.get<any>(this.baseApiUrl + id, this.authService.httpOptionsProvider());
  }

  addComment(formData: any) {
    return this.http.post<any>(`${this.baseApiUrl}add`, formData, this.authService.httpOptionsProvider());
  }

  updateComment(empObj: any) {
    return this.http.put<any>(`${this.baseApiUrl}update`, empObj, this.authService.httpOptionsProvider());
  }

  deleteComment(id: any) {
    return this.http.delete<any>(`${this.baseApiUrl}${id}`, this.authService.httpOptionsProvider());
  }
}
