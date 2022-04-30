import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommentService } from 'src/app/shared/services/comment.service';

@Component({
  selector: 'app-user-comments',
  templateUrl: './user-comments.component.html',
  styleUrls: ['./user-comments.component.scss'],
})
export class UserCommentsComponent implements OnInit {
  public userId!: any;
  public commentsArray!: any;
  isCommentArrayEmpty!: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((id) => {
      this.userId = id['id'];
    });
    this.getAllCommentsByUser();
  }

  getAllCommentsByUser() {
    this.commentService.getAllCommentbyUserId(Number(this.userId)).subscribe({
      next: (res) => {
        this.commentsArray = res.result;

        if (this.commentsArray.length > 0) {
          this.isCommentArrayEmpty = false;
          this.commentsArray.forEach((element: any) => {
            element.createdDate = element?.createdDate.slice(0, 10);
            element.updatedDate = !!element?.updatedDate
              ? element?.updatedDate.slice(0, 10)
              : null;
          });
        } else {
          this.isCommentArrayEmpty = true;
          this.commentsArray = [];
        }
      },
    });
  }

  seeIndividualBlog(id: any) {
    this.router.navigate([`blog/blog/${id}`]);
  }

  returnToProfile() {
    this.router.navigate([`blog/user/${this.userId}`]);
  }
  seeBlogList() {
    this.router.navigate([`blog/blog`]);
  }
}
