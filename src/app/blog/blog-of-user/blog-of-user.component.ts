import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../shared/services/blog.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blog-of-user',
  templateUrl: './blog-of-user.component.html',
  styleUrls: ['./blog-of-user.component.scss'],
})
export class BlogOfUserComponent implements OnInit {
  constructor(
    private blogService: BlogService,
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {}

  public blogList: any = [];
  profileId!: number;
  profileName!: string;
  profileUserImage!: any;
  isActualUser !: boolean;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((id) => {
      this.profileId = id['id'];
    });

    this.getBlogs();
    this.getUser();
    this.isActualUser = this.profileId == this.authService.getLoggedInUserID();
    
  }

  getBlogs() {
    this.blogService.getBlogByUser(this.profileId).subscribe({
      next: (res) => {
        this.blogList = res.result;
        if (this.blogList) {
          this.blogList.forEach((element: any) => {
            element.blogImg = `https://localhost:44364/${element.blogImg}`;
          });
        } else {
          this.blogList = [];
        }
      },
      error: (err) => {
        alert(`An error has occured. Please try again later `);
      },
    });
  }

  getUser() {
    this.userService.getUserbyId(this.profileId).subscribe({
      next: (res) => {
        this.profileName = res.result.fullName;
        this.profileUserImage = `https://localhost:44364/${res.result.profileImgUrl}`;
      },
      error: (err) => {
        alert(`An error has occured. Please try again later `);
      },
    });
  }

  getDate(date: any) {

    return date.slice(0, 10)
  }

  seeBlogDetails(id: any) {
    this.router.navigate([`blog/blog/${id}`]);
  }

  seeUserDetails() {
    this.router.navigate([`blog/user/${this.profileId}`]);
  }
}
