import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { MessageService, Message, MessageStatus } from './message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  //providers: [LoginService]
})
export class AppComponent {
    public messages:Message[] = [];
    public MessageStatus=MessageStatus;

    constructor(private loginService: LoginService, private messageService:MessageService) {
      this.messages = messageService.messages;
    }

    logout() {
        this.loginService.logout();
    }

    isLoggedIn() : Boolean{
        return this.loginService.IsLoggedIn();
      }

    closeModal(message:Message) {
        this.messages.splice(this.messages.indexOf(message), 1);
    }

    getEnvironment() {
        return this.loginService.environment;
    }

    getUserName() {
        return this.loginService.userName;
    }
}