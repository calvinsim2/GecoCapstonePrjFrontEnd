import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BlogComponent } from './blog.component';
import { HomeComponent } from './home/home.component';
import { RulesComponent } from './rules/rules.component';
import { AllBlogComponent } from './all-blog/all-blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogOfUserComponent } from './blog-of-user/blog-of-user.component';
import { UserComponent } from './user/user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserCommentsComponent } from './user-comments/user-comments.component';

import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: BlogComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'rules', component: RulesComponent },
      { path: 'blog', component: AllBlogComponent, canActivate: [AuthGuard] },
      {
        path: 'blog/:id',
        component: BlogDetailComponent,
        canActivate: [AuthGuard],
      },
      { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
      {
        path: 'user/blog/:id',
        component: BlogOfUserComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'user/comments/:id',
        component: UserCommentsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'user/:id',
        component: UserDetailComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogRoutingModule {}
