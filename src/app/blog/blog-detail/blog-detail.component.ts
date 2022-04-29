import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { BlogService } from '../../shared/services/blog.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommentService } from 'src/app/shared/services/comment.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BlogModel } from '../../shared/models/blog.model';
import { CommentModel } from 'src/app/shared/models/comment.model';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
})
export class BlogDetailComponent implements OnInit {
  // blog related variables
  public blogForm!: FormGroup;
  public commentForm!: FormGroup;
  blogId!: number;
  blogData!: any;
  blogPublishDate!: any;
  blogUpdatedDate!: any;
  blogObj = new BlogModel();
  public files: any;
  public imgUrl: string | ArrayBuffer | null = '';
  isDeletingBlog!: boolean;
  // authentication related variables
  currentUserId!: any;
  isEditable!: boolean;
  isDeletable!: boolean;
  isPublic!: boolean;
  isPublicColor!: string;
  userIsAdmin!: boolean;
  // comments related variables
  commentObj = new CommentModel();
  commentArray: any = [];
  isCommentArrayEmpty!: boolean;
  isEditingComment!: boolean;
  isDeletingComment!: boolean;
  currentEditCommentID!: any;
  currentSelectedCommentIDtoDelete!: any;

  public Editor = ClassicEditor;
  public currentEditor = {
    content: '',
    commentsContent: '',
  };

  constructor(
    private blogService: BlogService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    // extract current data from logged in user using activatedRoute
    this.activatedRoute.params.subscribe((id) => {
      this.blogId = id['id'];
    });

    // initialize form, and assign requirement
    this.blogForm = this.formBuilder.group({
      Title: ['', Validators.required],
      Description: ['', Validators.required],
      BlogImg: [''],
      IsVisible: false,
    });

    // obtain current logged in userID from authService
    this.currentUserId = this.authService.getLoggedInUserID();
    // check if log in user is admin
    this.userIsAdmin = this.authService.getLoggedInRoleID() == 3 ? true : false;
    this.getBlogDetails();
  }

  // api to fetch ALL Blogs
  getBlogDetails() {
    this.blogService.getBlogbyId(Number(this.blogId)).subscribe((res: any) => {
      this.blogData = res.result;
      this.isPublic = this.blogData.isVisible;
      // if blog is NOT public, redirect non owners away.
      if (!this.isPublic) {
        if (res.result.userID != this.authService.getLoggedInUserID()) {
          this.router.navigate(['blog/blog']);
        }
      }
      this.blogData.blogImg = `https://localhost:44364/${res?.result?.blogImg}`;
      this.blogData.user.profileImgUrl = `https://localhost:44364/${res?.result?.user?.profileImgUrl}`;
      this.blogPublishDate = this.blogData?.publishDate.slice(0, 10);
      this.blogUpdatedDate = !!this.blogData?.updatedDate
        ? this.blogData?.updatedDate.slice(0, 10)
        : null;
      this.isEditable =
        this.authService.getLoggedInUserID() == this.blogData?.userID;
      this.isDeletable =
        this.authService.getLoggedInUserID() == this.blogData?.userID ||
        this.userIsAdmin;

      this.commentArray = this.blogData?.comments;
      this.currentEditor.content = this.blogData?.content;
      if (this.commentArray.length > 0) {
        this.isCommentArrayEmpty = false;
        this.commentArray.forEach((element: any) => {
          element.user.profileImgUrl = `https://localhost:44364/${element.user.profileImgUrl}`;
        });
      } else {
        this.isCommentArrayEmpty = true;
      }
    });
  }

  // upload files
  loadProfileImage(event: any) {
    if (!event.target.files[0] || event.target.files.length === 0) {
      alert('Select an Image!');
      return;
    }

    let fileType = event.target.files[0].type;
    if (fileType.match(/image\/*/) == null) {
      alert('only images are supported!');
      return;
    }
    if (event.target.files[0].size > 1200000) {
      alert('max size exceeded');
      return;
    }

    this.files = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.imgUrl = reader.result;
    };
  }

  // Edit / Delete BLOG

  onEditBlog() {
    this.isDeletingBlog = false;
    this.imgUrl = this.blogData?.blogImg;
    this.blogForm.controls['Title'].setValue(this.blogData.title);
    this.blogForm.controls['Description'].setValue(this.blogData.description);
    this.blogForm.controls['IsVisible'].setValue(this.blogData.isVisible);
  }

  updateBlog() {
    this.blogObj.BlogID = this.blogId;
    this.blogObj.Title = this.blogForm.value.Title;
    this.blogObj.Description = this.blogForm.value.Description;
    this.blogObj.Content = this.currentEditor.content;
    this.blogObj.IsVisible = this.blogForm.value.IsVisible;
    this.blogObj.UserID = this.authService.getLoggedInUserID();

    let formData = new FormData();
    formData.append('BlogDetails', JSON.stringify(this.blogObj));
    formData.append('BlogImage', this.files);
    this.blogService.updateBlog(formData).subscribe({
      next: (res) => {
        alert(res.message);
        this.getBlogDetails();
        this.blogForm.reset();
        this.currentEditor.content = '';
        document.getElementById('close-emp')?.click();
      },
      error: (err) => {
        alert(`An error has occured. Please try again later `);
      },
    });
  }

  onDeleteBlog() {
    this.isDeletingBlog = true;
  }

  deleteBlog() {
    this.blogService.deleteBlog(this.blogId).subscribe({
      next: (res) => {
        alert(`${res.message}`);
        document.getElementById('close-emp')?.click();
        this.router.navigate([`blog/blog`]);
      },

      error: (err) => {
        alert('An error has occured.');
      },
    });
  }

  onInsertComments() {
    this.isEditingComment = false;
    this.isDeletingComment = false;
    this.currentEditor.commentsContent = '';
  }

  insertComments() {
    this.commentObj.UserID = this.authService.getLoggedInUserID();
    this.commentObj.Comment = this.currentEditor.commentsContent;
    this.commentObj.BlogID = this.blogId;

    this.commentService.addComment(this.commentObj).subscribe({
      next: (res) => {
        this.currentEditor.commentsContent = '';
        alert('Comment added!');
        this.getBlogDetails();
        document.getElementById('close-emp-comment')?.click();
      },

      error: (err) => {
        alert(`${err.message} - an error has occured`);
      },
    });
  }

  // Edit / Delete Comments

  onEditComments(comment: any, commentid: any) {
    this.isEditingComment = true;
    this.isDeletingComment = false;
    this.currentEditCommentID = commentid;
    this.currentEditor.commentsContent = comment;
  }
  editComments() {
    this.commentObj.UserID = this.authService.getLoggedInUserID();
    this.commentObj.Comment = this.currentEditor.commentsContent;
    this.commentObj.BlogID = this.blogId;
    this.commentObj.CommentID = this.currentEditCommentID;

    this.commentService.updateComment(this.commentObj).subscribe({
      next: (res) => {
        alert(`${res.message} - comment has been updated`);
        this.currentEditor.commentsContent = '';
        this.currentEditCommentID = null;
        document.getElementById('close-emp-comment')?.click();
        this.getBlogDetails();
      },
      error: (err) => {
        console.log(err);
        alert(`Sorry, please try again.`);
      },
    });
  }

  onDeleteComments(id: any) {
    this.isEditingComment = false;
    this.isDeletingComment = true;
    this.currentSelectedCommentIDtoDelete = id;
  }

  deleteComments() {
    this.commentService
      .deleteComment(this.currentSelectedCommentIDtoDelete)
      .subscribe({
        next: (res) => {
          alert('Selected comment have been deleted!');
          document.getElementById('close-emp-comment')?.click();
          this.currentSelectedCommentIDtoDelete = null;
          this.getBlogDetails();
        },
        error: (err) => {
          alert('Sorry, please try again.');
        },
      });
  }

  // Misc Functions

  // - set color to display private/public status.
  getColor() {
    return (this.isPublicColor = this.isPublic ? 'springgreen' : 'red');
  }

  getDate(date: any) {
    return date.slice(0, 10);
  }

  // For Navigation

  seeBlogList() {
    this.router.navigate([`blog/blog`]);
  }

  toUserPage(id: any) {
    this.router.navigate([`blog/user/${id}`]);
  }

  toBloggerProfilePage() {
    this.router.navigate([`blog/user/${this.blogData.user.userID}`]);
  }
}
