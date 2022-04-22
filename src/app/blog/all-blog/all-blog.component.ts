import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BlogService } from '../../shared/services/blog.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { BlogModel } from '../../shared/models/blog.model';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-all-blog',
  templateUrl: './all-blog.component.html',
  styleUrls: ['./all-blog.component.scss'],
})
export class AllBlogComponent implements OnInit {
  constructor(
    private blogService: BlogService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  public myForm!: FormGroup;
  public blogList: any = [];
  public files: any;
  public imgUrl: string | ArrayBuffer | null = null;
  public blogObj = new BlogModel();
  public currentUserId!: number;
  public currentRoleId!: any;
  public allowAdd!: boolean;

  public Editor = ClassicEditor;
  public currentEditor = {
    content: '',
  };

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      Title: ['', Validators.required],
      Description: ['', Validators.required],
      // Content: ['', Validators.required],
      BlogImg: [''],
      IsVisible: false,
    });
    this.currentRoleId = this.authService.getLoggedInRoleID();
    this.allowAdd = this.currentRoleId == '1';
    this.getAllBlogs();
  }

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

  getAllBlogs() {
    this.blogService.getAllBlog().subscribe({
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

  onAddBlog() {
    this.myForm.reset();
    this.imgUrl = this.blogList.blogImg;
    this.currentEditor.content = '';
  }

  addNewBlog() {
    if (this.myForm.valid) {
      this.blogObj.Title = this.myForm.value.Title;
      this.blogObj.Description = this.myForm.value.Description;
      this.blogObj.Content = this.currentEditor.content;
      this.blogObj.IsVisible = !!this.myForm.value.IsVisible
        ? this.myForm.value.IsVisible
        : false;
      this.blogObj.UserID = this.authService.getLoggedInUserID();

      let formData = new FormData();
      formData.append('BlogDetails', JSON.stringify(this.blogObj));
      formData.append('BlogImage', this.files);

      this.blogService.addBlog(formData).subscribe({
        next: (res) => {
          this.myForm.reset();
          this.currentEditor.content = '';
          document.getElementById('close-emp')?.click();
          alert(`${res.message}`);
          this.getAllBlogs();
        },
        error: (err) => {
          alert(`An error has occured. Please try again later `);
        },
      });
    } else {
      alert('Error in Values Provided!');
    }
  }

  getDate(date: any) {
    return date.slice(0, 10);
  }

  seeDetails(id: any) {
    this.router.navigate([`blog/blog/${id}`]);
  }
}
