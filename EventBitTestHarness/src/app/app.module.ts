import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header.component';
import { LoginComponent } from './login.component';
import { MainBody } from './body.component';

import { LoginService } from './login.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    MainBody
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
