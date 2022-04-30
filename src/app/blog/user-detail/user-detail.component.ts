import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { RoleService } from 'src/app/shared/services/role.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserModel } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private roleService: RoleService
  ) {}

  userId!: number;
  userRole!: any;
  isBlogger: boolean = false;
  userData!: any;
  public userForm!: FormGroup;
  public changePasswordForm!: FormGroup;
  public files: any;
  public imgUrl: string | ArrayBuffer | null = '';
  userObj = new UserModel();
  blogArray: any = [];
  commentsArray: any = [];
  isEditable!: boolean;
  changingPassword!: boolean;
  isActualUser!: boolean;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((id) => {
      this.userId = id['id'];
    });

    this.userForm = this.formBuilder.group({
      Email: ['', Validators.required],
      FullName: ['', Validators.required],
    });

    this.changePasswordForm = this.formBuilder.group({
      Email: ['', Validators.required],
      OldPassword: ['', Validators.required],
      NewPassword: ['', Validators.required],
    });
    this.getUserDetails();
    this.isEditable = this.userId == this.authService.getLoggedInUserID();
  }

  getUserDetails() {
    this.userService.getUserbyId(Number(this.userId)).subscribe({
      next: (res) => {
        this.userData = res.result;
        this.userData.profileImgUrl = `https://localhost:44364/${res?.result?.profileImgUrl}`;
        this.userData.joinedDate = this.userData?.joinedDate.slice(0, 10);
        this.blogArray = this.userData?.blogs;
        if (this.blogArray.length > 0) {
          this.blogArray.forEach((element: any) => {
            element.blogImg = `https://localhost:44364/${element.blogImg}`;
          });
        }
        this.commentsArray = this.userData?.comments;
        this.getRoleName(this.userData.roleID);
      },
      error: (err) => {
        alert(err.message);
        this.router.navigate([`blog/home`]);
      },
    });
  }

  getRoleName(id: any) {
    this.roleService.getRolebyId(id).subscribe({
      next: (res) => {
        this.userRole = res.result.roleName;
        this.isBlogger = this.userRole == 'Blogger';
      },

      error: (err) => {
        console.log(err);
      },
    });
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

  onEditUser() {
    this.changingPassword = false;
    this.imgUrl = this.userData?.profileImgUrl;
    this.userForm.controls['Email'].setValue(this.userData.email);
    this.userForm.controls['FullName'].setValue(this.userData.fullName);
  }

  updateUser() {
    this.userObj.UserID = this.authService.getLoggedInUserID();
    this.userObj.email = this.userForm.value.Email;
    this.userObj.fullName = this.userForm.value.FullName;
    this.userObj.roleID = this.authService.getLoggedInRoleID();

    let formData = new FormData();
    formData.append('UserDetails', JSON.stringify(this.userObj));
    formData.append('UserImage', this.files);
    this.userService.updateUser(formData).subscribe({
      next: (res) => {
        alert(res.message);
        this.getUserDetails();
        this.userForm.reset();
        document.getElementById('close-emp')?.click();
      },
      error: (err) => {
        alert(`${err.error.message}`);
      },
    });
  }

  onChangingPassword() {
    this.changePasswordForm.controls['Email'].setValue(this.userData.email);
    this.changePasswordForm.controls['OldPassword'].setValue('');
    this.changePasswordForm.controls['NewPassword'].setValue('');
    this.changingPassword = true;
  }

  changePassword() {
    this.authService.changingPassword(this.changePasswordForm.value).subscribe({
      next: (res) => {
        alert('Password has been changed successfully!');
        this.getUserDetails();
        this.changePasswordForm.reset();
        document.getElementById('close-emp')?.click();
      },
      error: (err) => {
        alert(
          `Either you entered an incorrect password, or something has gone wrong.`
        );
      },
    });
  }

  getDate(date: any) {
    return date.slice(0, 10);
  }

  seeDetails(id: any) {
    this.router.navigate([`blog/blog/${id}`]);
  }

  seeAllBlogsByUser(id: any) {
    this.router.navigate([`blog/user/blog/${id}`]);
  }

  seeCommentsMadeByUser() {
    this.router.navigate([`blog/user/comments/${this.userId}`]);
  }
}
