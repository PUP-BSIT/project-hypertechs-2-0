import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Scribe App Components*/
import { LandingComponent } from './public/landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { MainComponent } from './core/main/main.component';
import { HomeComponent } from './core/home/home.component';
import { NotesComponent } from './core/notes/notes.component';
import { TasksComponent } from './core/tasks/tasks.component';
import { FoldersComponent } from './core/folders/folders.component';
import { TrashComponent } from './core/trash/trash.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'main', component: MainComponent, children: [
      { path: 'home', component: HomeComponent },
      { path: 'notes', component: NotesComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'folders', component: FoldersComponent },
      { path: 'trash', component: TrashComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }