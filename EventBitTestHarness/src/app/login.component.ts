import { Component } from '@angular/core';
import { LoginService } from './login.service';

@Component({
    selector: 'login',
    template: `
    <form (ngSubmit)="login()" #loginForm="ngForm" style="background:#dff0d8">
        <h2>Login</h2>

        <table class="loginTable">
            <tr>
                <td>
                    <label>Environment:</label>
                </td>
                <td>
                    <select [(ngModel)]="environment" name="environment" style="width:100%;height:26px;">
                        <option value="dev">
                            Dev
                        </option>
                        <option value="qa">
                            Qa
                        </option>
                        <option value="prod" disabled>
                            Prod
                        </option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>
                    <label>UserName:</label>
                </td>
                <td>
                    <input type="text" [(ngModel)]="userName" required name="userName" />
                </td>
            </tr>
            <tr>
                <td>
                    <label>Password:</label>
                </td>
                <td>
                    <input type="password" [(ngModel)]="password" required name="password" />
                </td>
            </tr>
        </table>

        <button>Login</button>
    </form>
    `
    //providers: [LoginService]
})
export class LoginComponent {
    environment : string;
    userName : string;
    password : string;
    //loginService: LoginService;

    constructor(private loginService: LoginService){
        //this.loginService = loginService;
    }

    login() {

        if(!this.userName || !this.password)
            return;

        this.loginService.login(this.userName, this.password, this.environment);
    }
}