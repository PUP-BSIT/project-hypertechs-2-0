/* Angular Components*/
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withJsonpSupport } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

/* Public Components*/
import { AppComponent } from './app.component';
import { LandingComponent } from './public/landing/landing.component';
import { NotFoundComponent } from './public/not-found/not-found.component';

/* Auth Components */
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { RecoveryComponent } from './auth/recovery/recovery.component';
import { EnterEmailComponent } from './auth/recovery/enter-email/enter-email.component';
import { EnterOtpComponent } from './auth/recovery/enter-otp/enter-otp.component';
import { EnterNewPasswordComponent } from './auth/recovery/enter-new-password/enter-new-password.component';

/*Layout Components */
import { BrandComponent } from './layout/brand/brand.component';
import { ThemeSwitchComponent } from './layout/theme-switch/theme-switch.component';
import { DialogComponent } from './layout/dialog/dialog.component';
import { TypingEffectComponent } from './layout/typing-effect/typing-effect.component';

/* Core Components */
import { MainComponent } from './core/main/main.component';
import { HomeComponent } from './core/home/home.component';
import { NotesComponent } from './core/notes/notes.component';
import { TasksComponent } from './core/tasks/tasks.component';
import { FoldersComponent } from './core/folders/folders.component';
import { TrashComponent } from './core/trash/trash.component';
import { NoteCardComponent } from './core/components/note-card/note-card.component';

/* Other Modules */
import { MaterialModule } from '../imports/material.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxMasonryModule } from 'ngx-masonry';

/* Services */
import { LoginService } from '../services/login/login.service';
import { SignupService } from '../services/signup/signup.service';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    BrandComponent,
    ThemeSwitchComponent,
    LoginComponent,
    MainComponent,
    HomeComponent,
    NotesComponent,
    TasksComponent,
    FoldersComponent,
    TrashComponent,
    SignupComponent,
    NotFoundComponent,
    RecoveryComponent,
    EnterEmailComponent,
    EnterOtpComponent,
    EnterNewPasswordComponent,
    DialogComponent,
    NoteCardComponent,
<<<<<<< feat/home
    TypingEffectComponent,
=======
>>>>>>> development
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    DragDropModule,
    NgxMasonryModule
  ],
  providers: [
    provideAnimationsAsync(),
    LoginService,
    provideHttpClient(withJsonpSupport()),
    SignupService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
