import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './public/landing/landing.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  {path: '', component: LandingComponent}, // default path
  {path: 'login', component: LoginComponent} // landing -> login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
