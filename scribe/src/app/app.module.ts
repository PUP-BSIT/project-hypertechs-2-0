import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LandingComponent } from './public/landing/landing.component';
import { BrandComponent } from './layout/brand/brand.component';
import { ThemeSwitchComponent } from './layout/theme-switch/theme-switch.component';
import { LoginComponent } from './auth/login/login.component';
import { MatButtonModule } from '@angular/material/button'
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoginService } from '../services/login.service';
import { provideHttpClient, withJsonpSupport } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    BrandComponent,
    ThemeSwitchComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  providers: [
    provideAnimationsAsync(),
    LoginService, 
    provideHttpClient(withJsonpSupport())
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
