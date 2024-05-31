import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './public/landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './core/home/home.component';

const routes: Routes = [
  { path: '', component: LandingComponent }, // default path: landing
  { path: 'login', component: LoginComponent }, // landing => login
  { path: 'home', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
