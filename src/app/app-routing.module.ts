import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((a) => a.LoginModule),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./signup/signup.module').then((a) => a.SignupModule),
  },
  {
    path: 'blog',
    loadChildren: () => import('./blog/blog.module').then((a) => a.BlogModule),
  },
  { path: '', redirectTo: 'blog', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
