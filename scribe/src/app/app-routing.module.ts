import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

/* Scribe App Components*/
import { LandingComponent } from './public/landing/landing.component';
import { NotFoundComponent } from './public/not-found/not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { MainComponent } from './core/main/main.component';
import { HomeComponent } from './core/home/home.component';
import { NotesComponent } from './core/notes/notes.component';
import { TasksComponent } from './core/tasks/tasks.component';
import { FoldersComponent } from './core/folders/folders.component';
import { TrashComponent } from './core/trash/trash.component';
import { SignupComponent } from './auth/signup/signup.component';
import { RecoveryComponent } from './auth/recovery/recovery.component';
import { EnterOtpComponent } from './auth/recovery/enter-otp/enter-otp.component';
import { EnterNewPasswordComponent } from './auth/recovery/enter-new-password/enter-new-password.component';
import { EditorComponent } from './core/components/editor/editor.component';
import { SearchComponent } from './core/components/search/search.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    data: { animationState: 'landing' },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { animationState: 'login' },
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: { animationState: 'signup' },
  },
  {
    path: 'recovery',
    component: RecoveryComponent,
    canActivate: [authGuard],
    data: { animationState: 'recovery' },
  },
  {
    path: 'enter-otp',
    component: EnterOtpComponent,
    canActivate: [authGuard],
    data: { animationState: 'enterOtp' },
  },
  {
    path: 'enter-new-password',
    component: EnterNewPasswordComponent,
    canActivate: [authGuard],
    data: { animationState: 'enterNewPass' },
  },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'notes', component: NotesComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'folders', component: FoldersComponent },
      { path: 'trash', component: TrashComponent },
      { path: 'editor', component: EditorComponent },
      { path: 'editor/:id', component: EditorComponent },
      { path: 'search', component: SearchComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }],
})
export class AppRoutingModule {}