import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

//Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header.component';
import { LoginComponent } from './login.component';
import { MainBody } from './mainbody.component';

//services
import { LoginService } from './login.service';
import { SnapShotService } from './snapshot.service';
import { EntityService } from './entity.service';
import { MessageService } from './message.service';

//boostrap
import { AlertModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';

//pipe
import {PageFilter} from './page.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    MainBody,
    PageFilter
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    AlertModule.forRoot(),
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot()
  ],
  providers: [
    LoginService, 
    SnapShotService, 
    EntityService,
    MessageService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
