import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';
import { UserModel } from '../shared/models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  public userForm!: FormGroup;
  currentRoleId: number = 1;
  public files: any;
  public imgUrl: string | ArrayBuffer | null = null;
  public userObj = new UserModel();
  hidePassword: boolean = false;
  text: any = 'password';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      Email: ['', Validators.required],
      Password: ['', Validators.required],
      FullName: ['', Validators.required],
      // ProfileImgUrl: [''],
      roleId: [''],
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

  onAddBlogger() {
    this.userForm.reset();
    this.imgUrl = '';
    this.files = null;
    this.currentRoleId = 1;
  }

  onAddUser() {
    this.userForm.reset();
    this.imgUrl = '';
    this.files = null;
    this.currentRoleId = 2;
  }

  addNewPerson() {
    this.userObj.email = this.userForm.value.Email;
    this.userObj.password = this.userForm.value.Password;
    this.userObj.fullName = this.userForm.value.FullName;
    this.userObj.roleID = this.currentRoleId;
    let formData = new FormData();
    formData.append('UserDetails', JSON.stringify(this.userObj));
    formData.append('UserImage', this.files);

    this.userService.addUser(formData).subscribe({
      next: (res) => {
        this.userForm.reset();
        document.getElementById('close-emp')?.click();
        alert(`add successful!`);
        this.router.navigate(['login']);
      },
      error: (err) => {
        console.log(err);
        alert(`${err.error.message}`);
      },
    });
  }

  onTogglePassword() {
    this.hidePassword = !this.hidePassword;
    this.text = this.hidePassword ? 'password' : 'text';
  }

  // navigate
  navigateToHome() {
    this.router.navigate([`blog/home`]);
  }

  navigateToLogIn() {
    this.router.navigate(['login']);
  }
}
