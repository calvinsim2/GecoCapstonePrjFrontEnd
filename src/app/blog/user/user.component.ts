import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  public userList!: any;
  public filterUserList: any = [];
  filterName: any = '';
  filterRole: any = '';
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.getLoggedInRoleID() != 3) {
      alert('Sorry, you do not have permission to view this page.');
      this.router.navigate(['blog/home']);
    }
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUser().subscribe({
      next: (res) => {
        this.userList = res.result;
        if (this.userList.length > 0) {
          this.userList.forEach((element: any) => {
            element.profileImgUrl = `https://localhost:44364/${element.profileImgUrl}`;
          });
          this.filterUserList = this.userList;
        } else {
          this.userList = [];
          this.filterUserList = this.userList;
        }
      },
      error: (err) => {
        alert('Error fetching, try again later.');
      },
    });
  }

  filterUserByName() {
    const regex = new RegExp(this.filterName, 'g');
    this.filterUserList = this.userList.filter((element: any) => {
      return element.fullName.match(regex);
    });
  }

  filterUserByRole() {
    if (this.filterRole == 'All') {
      this.filterUserList = this.userList;
    } else {
      const regex = new RegExp(this.filterRole, 'g');
      this.filterUserList = this.userList.filter((element: any) => {
        return element.role.roleName.match(regex);
      });
    }
  }

  getDate(date: any) {
    return date.slice(0, 10);
  }

  setCardColor(id: any) {
    // return  == true ? 'lightgreen' : 'mistyrose';
    if (id == 1) {
      return 'orchid';
    } else if (id == 2) {
      return 'lightcoral';
    } else {
      return 'lightgreen';
    }
  }

  // For Navigation

  toUserPage(id: any) {
    this.router.navigate([`blog/user/${id}`]);
  }
}
