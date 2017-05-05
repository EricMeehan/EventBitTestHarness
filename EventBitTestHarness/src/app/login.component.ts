import { Component } from '@angular/core';
import { LoginService } from './login.service';

@Component({
    selector: 'login',
    template: `
        <h2>Login</h2>
        <label>UserName:</label>
        <input type="text" [(ngModel)]="userName"/>
        <br/>
        <label>Password:</label>
        <input type="text" [(ngModel)]="password"/>
        <br/>
        <button (click)="login()">Login</button>
    `
    //providers: [LoginService]
})
export class LoginComponent {
    userName : string;
    password : string;
    //loginService: LoginService;

    constructor(private loginService: LoginService){
        //this.loginService = loginService;
    }

    login() {
        this.loginService.login(this.userName, this.password);
    }
}