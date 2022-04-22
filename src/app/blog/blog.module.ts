import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BlogRoutingModule } from './blog-routing.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AllBlogComponent } from './all-blog/all-blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { UserComponent } from './user/user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { BlogComponent } from './blog.component';
import { HomeComponent } from './home/home.component';
import { RulesComponent } from './rules/rules.component';
import { BlogOfUserComponent } from './blog-of-user/blog-of-user.component';



@NgModule({
  declarations: [
    AllBlogComponent,
    BlogDetailComponent,
    UserComponent,
    UserDetailComponent,
    BlogComponent,
    HomeComponent,
    RulesComponent,
    BlogOfUserComponent,
    
    
  ],
  imports: [ReactiveFormsModule, CommonModule, BlogRoutingModule, FormsModule, CKEditorModule],
})
export class BlogModule {}
